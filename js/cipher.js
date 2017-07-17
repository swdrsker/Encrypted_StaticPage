var pass, secret_key;

window.onload = function(){
  pass = window.prompt("Enter password", "")
  secret_key = CryptoJS.SHA256(pass).toString()

  //Encrypt
  //var ciphertext = CryptoJS.AES.encrypt('my message', secret_key).toString();

  // Decrypt
  //var bytes  = CryptoJS.AES.decrypt(ciphertext, secret_key);
  //var plaintext = bytes.toString(CryptoJS.enc.Utf8);

  disp();
}

$(function() {
  $("#encrypt").on("click",function(){
    var ciphertext = CryptoJS.AES.encrypt($("#markdown").val(), secret_key).toString();
    execCopy("\"" + ciphertext + "\"");
    alert("Copied encrypted text!!\n\n"+ciphertext);
  });
  $("#changepass").on("click", function(){
    pass = window.prompt("Create new password", "")
    secret_key = CryptoJS.SHA256(pass).toString()
  });
});


var disp = function(){
  var ciphertext = GetMarkdownData()
  while(true){
    try{
      var bytes  = CryptoJS.AES.decrypt(ciphertext, secret_key);
      var plaintext = bytes.toString(CryptoJS.enc.Utf8);
      break
    }
    catch (e) {
      if(window.confirm("Invalid password :(\n Create new password?")==true){
          pass = window.prompt("Create new password", "")
          secret_key = CryptoJS.SHA256(pass).toString()
          var plaintext="# HELLO WORLD \n This is a secret page for you."
          break
      }else{
        pass = window.prompt("Enter password", "")
        secret_key = CryptoJS.SHA256(pass).toString()
      };
    };
  }

  new Vue({
    el: '#editor',
    data: {
      input: plaintext
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.input, { sanitize: true })
      }
    },
    methods: {
      update: _.debounce(function (e) {
        this.input = e.target.value
      }, 300)
    }
  })
}

function execCopy(string){
  var temp = document.createElement('textarea');

  temp.value = string;
  temp.selectionStart = 0;
  temp.selectionEnd = temp.value.length;

  var s = temp.style;
  s.position = 'fixed';
  s.left = '-100%';

  document.body.appendChild(temp);
  temp.focus();
  var result = document.execCommand('copy');
  temp.blur();
  document.body.removeChild(temp);
  // true なら実行できている falseなら失敗か対応していないか
  return result;
}
