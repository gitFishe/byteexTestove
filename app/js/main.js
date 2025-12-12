const only_num = /^[0-9.]+$/;
const tel_reg = /^[0-9+]+$/;
const only_num_replace = /[^0-9.]/g;
const tel_reg_replace = /[^0-9+]/g;
const password_reg = /^(?=.*[a-zA-Z])(?=.*\d).*$/;
const email_reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const email_reg_full = /^(([^<>()\[\]\\.,;:\s@"]{2,62}(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-аА-яЯ\-0-9]+\.)+[a-zA-Z-аА-яЯ]{2,62}))$/;
const validationRules = {
  'email': {
    'rules': {
      regex: email_reg
    }
  },
  'emailfull': {
    'rules': {
      regex: email_reg_full
    }
  },
  'numeric': {
    'rules': {
      regex: only_num
    }
  },
  'numeric-replace': {
    'rules': {
      regexReplace: only_num_replace
    }
  },
  'phone': {
    'rules': {
      regexReplace: tel_reg_replace
    }
  },
  'password': {
    'rules': {
      regex: password_reg,
    }
  },
  'password_repeat': {
    'rules': {
      password_repeat: true
    }
  }
};

function formReset(form){
  if (typeof form.dataset.noReset !== 'undefined' || form.classList.contains('no-reset')) {
    return;
  }
  form.reset();
  form.querySelectorAll('.output_value').forEach(item=>item.value='')
  form.querySelectorAll('.is-selected').forEach(item=>item.classList.remove('is-selected'))
  form.querySelectorAll('.image-preview').forEach(item=>item.remove())
  form.querySelectorAll('.ql-editor').forEach(item=>item.innerHTML = '')
  form.querySelectorAll('.is-visible').forEach(item=>item.classList.remove('is-visible'))

}
function ajaxSuccess(form, data){
    data = data['responseJSON'] || data['data'] || data
    let popupSuccess = form.dataset.successPopup;
    let formBtn = form.querySelector('[type="submit"]');
    let thisSection = form.closest('.show-hide-on-success') || form.closest('section') || form
    let showOnSuccess = thisSection.querySelector('.show-on-success')
    let hideOnSuccess = thisSection.querySelector('.hide-on-success')
    let redirectUrl = data["redirect_url"] || data["redirect"] || form.dataset.redirect

    if (form['ajaxSuccess']){
      form['ajaxSuccess'](form, data)
    }

    Fancybox.close();

    if (redirectUrl){
      window.location.href = redirectUrl;
      return;
    }
    if (formBtn){
      formBtn.removeAttribute('disabled');
    }

    if (popupSuccess) {
      Fancybox.show([{
        src: popupSuccess,
        type: 'inline',
        placeFocusBack: false,
        trapFocus: false,
        autoFocus: false
      }], {
        dragToClose: false
      });
    }
    if(hideOnSuccess){
      fadeOut(hideOnSuccess, 300, function () {
        if(showOnSuccess) {
          fadeIn(showOnSuccess, 300)
        }
      })
    } else if(showOnSuccess){
      fadeIn(showOnSuccess, 300)
    }

    formReset(form)
}
function ajaxError(form, data){
    data = data['responseJSON'] || data['data'] || data
    let formBtn = form.querySelector('[type="submit"]');
    let popupError = form.dataset.errorPopup;

    if (form['ajaxError']){
      form['ajaxError'](form, data)
    }

    Fancybox.close();

    if (formBtn) {
        formBtn.removeAttribute('disabled');
    }
    if(typeof data === 'object' && data['errors']){
      let scrolledToInput = false
      Object.keys(data['errors']).forEach(name => {
          let formInput = form.querySelector(`[name="${name}"]`)
          if(formInput && formInput['setError']) {
              formInput.setError(data['errors'][name])
              if(!scrolledToInput){
                  if(document.scrollTo) {
                      document.scrollTo(formInput, 700)
                  }
                  scrolledToInput = true;
              }
          }
      })
    }
    if (popupError) {
      Fancybox.show([{
        src: popupError,
        type: 'inline',
        placeFocusBack: false,
        trapFocus: false,
        autoFocus: false
      }], {
        dragToClose: false
      });
    }
}
function onSubmit(form, thisFormData = false) {
    let formData = thisFormData || new FormData(form);
    let action = form.getAttribute('action') || '/wp-admin/admin-ajax.php';
    let method = form.getAttribute('method') || 'post';
    let formBtn = form.querySelector('[type="submit"]');
    let editors = form.querySelectorAll('.ql-editor');
    let xhr = new XMLHttpRequest();

    if (editors.length) {
      editors.forEach(function(editor) {
        let thisName = editor.closest('[data-name]');
        editor.querySelectorAll('.ql-emojiblot').forEach(function(emoji){
            emoji.outerHTML = emoji.textContent
        })
        let thisValue = editor.innerHTML;
        if (!thisName) return;
        thisName = thisName.dataset.name;
        formData.append(thisName, thisValue);
      });
    }

    if (formBtn) {
      formBtn.setAttribute('disabled', 'disabled');
    }

    xhr.open(method, action);
    xhr.send(formData);
    xhr.onload = function() {
      let data = xhr.responseText

      try { data = JSON.parse(data) } catch (error) {}

      if (xhr.status === 200) {
        ajaxSuccess(form, data)
      } else {
        ajaxError(form, data)
      }
    };
}

// Connect all sections
let sectionsJS = {};
function sectionJS(selector = '', callback){
  if(!selector || typeof callback !== 'function'){
    return;
  }
  sectionsJS[selector] = callback;
}

function blocks() {
  let commonSections = {
    '.calc': function (sections) {
      sections.forEach(function(section){

      })
    },
  };
  let allSections = {
    ...commonSections,
    ...sectionsJS
  }

  Object.keys(allSections).forEach(selector => {
    if (document.querySelector(selector)) {
      allSections[selector](document.querySelectorAll(selector));
    }
  })
}

document.addEventListener('DOMContentLoaded', function () {
  blocks();

  if(typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox]', {
      dragToClose: false
    })
    // Fancybox.show([{
    //   src: '#modal_error',
    //   type: 'inline',
    //   placeFocusBack: false,
    //   trapFocus: false,
    //   autoFocus: false,
    // }], {
    //   dragToClose: false,
    //   on: {
    //     "destroy": (event, fancybox, slide) => {
    //       clearTimeout(closeTimeout)
    //
    //       if(activePopup){
    //         openPopup(false, activePopup)
    //       }
    //     },
    //   }
    // })
  }
})