window.onload = function() {

    function selectFromTo( textInput, i1, i2) {
        if ( textInput.selectionStart ) {
            textInput.setSelectionRange(i1,i2);
            textInput.focus();
        } else if ( textInput.createTextRange) {
            var range = textInput.createTextRange();
            range.moveStart('character', i1);
            range.moveEnd('character', i2);
            range.select();
        } else {
            console.log("select-error");
        }
    }
    function createButton(id, innerHTML) {
        const button = document.createElement("button");
        button.id = id;
        button.type = "button";
        button.innerHTML = innerHTML;
        button.className = "gr-button gr-button-lg gr-button-tool";
        return button;
    }

    function getLanguage(text) {
        var sl = "auto";
        var tl = "en";
        let translateUrl = "https://translate.googleapis.com/translate_a/single?format=text&client=gtx&sl=" + sl + "&tl=" + tl + "&dt=t&q=" + text;
        let translatedText = httpGet(translateUrl);
        function httpGet(url) {
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open("GET", url, false);
          xmlHttp.send(null);
          return xmlHttp.responseText;
        }

        try {

            var result = JSON.parse(translatedText)[2];

        } catch (e) {

            var result = (navigator.language || navigator.userLanguage).split('-')[0];

        }
        

        return result
    }

    function translate(originalText) {
    
        var sl = "auto";
        var tl = "en";

        if (getLanguage(originalText) == "en"){
            var tl = (navigator.language || navigator.userLanguage).split('-')[0];
        }

        let translateUrl = "https://translate.googleapis.com/translate_a/single?format=text&client=gtx&sl=" + sl + "&tl=" + tl + "&dt=t&q=" + originalText;
        let translatedText = httpGet(translateUrl);
        function httpGet(url) {
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open("GET", url, false);
          xmlHttp.send(null);
          return xmlHttp.responseText;
        }

        try {

            var result = JSON.parse(translatedText)[0][0][0];

        } catch (e) {

            var result = '';

        }


        return result
    }

    function dispatchInputEvent(target) {
        let inputEvent = new Event("input");
        Object.defineProperty(inputEvent, "target", { value: target });
        target.dispatchEvent(inputEvent);
    }

    let div = gradioApp().querySelector('#txt2img_tools');

    div.append(createButton("translate_button_t2i", "Ŧ"));

    let button_t2i = gradioApp().querySelector('#translate_button_t2i');
    button_t2i.onclick = function(){
        let prompt = gradioApp().querySelector('#txt2img_prompt > label > textarea');
        let negative_prompt = gradioApp().querySelector('#txt2img_neg_prompt > label > textarea');
        var start_position = prompt.selectionStart;
        var end_position = prompt.selectionEnd;
        var nstart_position = negative_prompt.selectionStart;
        var nend_position = negative_prompt.selectionEnd;
        if (prompt.value.substring(start_position,end_position) != ""){
            var ttext = translate(prompt.value.substring(start_position,end_position))   
            prompt.value = prompt.value.substring(0,start_position) + ttext + prompt.value.substring(end_position, prompt.value.length)
            selectFromTo(prompt, start_position, start_position+ttext.length)
        }
        else if(negative_prompt.value.substring(nstart_position,nend_position) != ""){
            var ttext = translate(negative_prompt.value.substring(nstart_position,nend_position))   
            negative_prompt.value = negative_prompt.value.substring(0,nstart_position) + ttext + negative_prompt.value.substring(nend_position, negative_prompt.value.length)
            selectFromTo(negative_prompt, nstart_position, nstart_position+ttext.length)
        }else{
            prompt.value = translate(prompt.value);
        }

        dispatchInputEvent(prompt);
        recalculate_prompts_txt2img();
        
    };

    let div2 = gradioApp().querySelector('#img2img_tools');

    div2.append(createButton("translate_button_i2i", "Ŧ"));

    let button_i2i = gradioApp().querySelector('#translate_button_i2i');

    button_i2i.onclick = function(){
        let prompt = gradioApp().querySelector('#img2img_prompt > label > textarea');
        let negative_prompt = gradioApp().querySelector('#img2img_neg_prompt > label > textarea');
        var start_position = prompt.selectionStart;
        var end_position = prompt.selectionEnd;
        var nstart_position = negative_prompt.selectionStart;
        var nend_position = negative_prompt.selectionEnd;
        if (prompt.value.substring(start_position,end_position) != ""){
            var ttext = translate(prompt.value.substring(start_position,end_position))   
            prompt.value = prompt.value.substring(0,start_position) + ttext + prompt.value.substring(end_position, prompt.value.length)
            selectFromTo(prompt, start_position, start_position+ttext.length)
        }
        else if(negative_prompt.value.substring(nstart_position,nend_position) != ""){
            var ttext = translate(negative_prompt.value.substring(nstart_position,nend_position))   
            negative_prompt.value = negative_prompt.value.substring(0,nstart_position) + ttext + negative_prompt.value.substring(nend_position, negative_prompt.value.length)
            selectFromTo(negative_prompt, nstart_position, nstart_position+ttext.length)
        }else{
            prompt.value = translate(prompt.value);
        }

        dispatchInputEvent(prompt);
        recalculate_prompts_txt2img();
        
    };
};

document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyT' && (event.altKey || event.metaKey)) {
    if (get_uiCurrentTab().outerText == "txt2img"){
        let button = gradioApp().querySelector('#translate_button_t2i');
        button.click();
    }else if(get_uiCurrentTab().outerText == "img2img"){
        let button = gradioApp().querySelector('#translate_button_i2i');
        button.click();
    }
    
  }
});

