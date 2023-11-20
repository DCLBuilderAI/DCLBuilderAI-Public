window.CMUtils = window.CMUtils || {};

CMUtils.enforceMaxLength = function (cm, change) {
  var maxLength = cm.getOption("maxLength");
  if (maxLength && change.update) {
    var str = change.text.join("\n");
    var delta = str.length - (cm.indexFromPos(change.to) - cm.indexFromPos(change.from));
    if (delta <= 0) { return true; }
    delta = cm.getValue().length + delta - maxLength;
    if (delta > 0) {
      str = str.substr(0, str.length - delta);
      change.update(change.from, change.to, str.split("\n"));
    }
  }
  return true;
}

// setting no.of characters left for prompts
function setElemPrompt(prompt, val) {
  var txtAreaVal = $(prompt).val()
  $(val).html(txtAreaVal.length)
}

// creating codeMirror Instance
let editorsArr = ['editor001'];
let themeName = 'idea';
const MaxCharacter = 5000;

var editorArray = []
var lu = 1;
var tmplu = scrptlu = 1;

// initializing the code mirror
var editor = CodeMirror.fromTextArea(document.getElementById('editor001'), {
  mode: 'text/typescript',
  theme: themeName,
  lineNumbers: true,
  autoRefresh: true,
  matchBrackets: true,
  autoCloseTags: true,
  maxLenght: MaxCharacter,
  autofocus: true,
})
editor.setSize('100%', '450')

editor.setOption("maxLength", MaxCharacter);
editor.on("beforeChange", CMUtils.enforceMaxLength);

editor.on('change', editor => {
  let x = editor.getValue();
  $('#editorMaxVal').html(x.length)
})

$('#editor001').data('CodeMirrorInstance', editor);
var codemirrorEditor = $('#editor001').data('CodeMirrorInstance');

editorArray = [editor]

// limit the editor instances
const maxEditors = 1;

for (var i = 1; i < maxEditors; i++) {

  var d = new Date();
  var time = d.getTime();
  var rand = Math.random() * 100;
  rand = Math.floor(rand + time);

  let editorhtml = `
    <div class="tab-pane TabEditor fade" id="tab${rand}" value="${lu}">
    <textarea id="editor${rand}">/** This is editor ${++scrptlu} */
var global_var = 10
</textarea>
      <input type="hidden" value="${lu}" class="inp">
    </div>
  `;
  let tabhtml = `
    <li class="nav-item">
      <a class="nav-link openTab" data-toggle="pill" value="tab${rand}" href="#tab${rand}">Script ${++tmplu}</a>
    </li>
  `;
  $('#appendeditor').append(editorhtml)
  $('#tabappendedi').append(tabhtml)

  // initializing the code mirror
  editor = CodeMirror.fromTextArea(document.getElementById(`editor${rand}`), {
    mode: 'text/typescript',
    theme: themeName,
    lineNumbers: true,
    autoRefresh: true,
    matchBrackets: true,
    autoCloseTags: true,
    maxLenght: MaxCharacter,
    autofocus: true,
  })

  editor.setSize('100%', '450')

  editor.on('change', editor => {
    let x = editor.getValue();
    $('#editorMaxVal').html(x.length)
  })

  lu++

  $(`.CodeMirror-sizer`).addClass('customMirror');
  $(`#editor${rand}`).data('CodeMirrorInstance', editor);
  editor.setOption("maxLength", MaxCharacter);
  editor.on("beforeChange", CMUtils.enforceMaxLength);

  editorArray.push(editor)
  // codemirrorEditor = editor

  let x = editor.getValue();
  $('#editorMaxVal').html(x.length)
}


/* opening the specific tab based on index*/
let defaultIndex = 0;
$.each($('.openTab'), function (index, val) {
  $(this).removeClass('active')
})
$.each($('.TabEditor'), function (index, val) {
  $(this).removeClass('active')
  $(this).addClass('fade')
})
let ttb = document.getElementsByClassName('TabEditor')[defaultIndex];
ttb.classList.add('active');
ttb.classList.remove('fade');
document.getElementsByClassName('openTab')[defaultIndex].classList.add('active');
codemirrorEditor = editorArray[defaultIndex]


/* max-length */
function checkTextCharacters(ch) {
  var x = '';
  for (var i = 0; i < ch.length; i++) {
    if (i < MaxCharacter) {
      x += ch[i];
    }
  }
  return x;
}
/* setting editor max lenght etc */

function countTextCharacters(ed) {
  var x = editor.getValue()
  return x.length;
}
function getSetNums(ed) {
  var x = countTextCharacters(ed);
  $('#editorMaxVal').html(x)
}
getSetNums(editor);

editor.on('keyup', () => {
  getSetNums(editor)
})
/* checking max-length ends here */

// Functions of Editor
$(document).ready(function () {

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  // var codemirrorEditor = $('#editor001').nextAll('.CodeMirror')[0].CodeMirror

  $(document).on('click', '.openTab', function () {

    setTimeout(() => {
      codeMrrInstance = $('#appendeditor .tab-pane.active .inp').val();

      codemirrorEditor = editorArray[codeMrrInstance]

      let y = editorArray[codeMrrInstance].getValue()
      $('#editorMaxVal').html(y.length)
    }, 400);
  })

  codemirrorEditor.on('keyup', () => {
    let x = codemirrorEditor.getValue()
    $('#editorMaxVal').html(x.length)
  })

  // changing the theme
  $('#changeTheme').on('change', function () {
    themeName = $(this).val()
    for (i in editorArray) {
      editorArray[i].setOption('theme', themeName)
    }
  })
  $('#changeTheme').select2()

  $('#hide').click(function () {
    codemirrorEditor.getDoc().setValue('')
  })

  // copy to clipboard code
  $('#copytoclip').on('click', function () {
    $(this).html('<span class="mdi delet-icon mdi-check edit1"></span>Copied')
    navigator.clipboard.writeText(codemirrorEditor.getValue())

    setTimeout(() => {
      $('#copytoclip').html(
        '<span class="mdi delet-icon mdi-content-copy delet1"></span>Copy',
      )
    }, 1000)
  })

  // downloading the file
  $('#downloadCode').on('click', function () {
    swal('Enter File Name here:', {
      content: 'input',
      buttons: {
        cancel: 'Cancel!',
        download: true,
      },
    }).then((value) => {
      switch (value) {
        case 'download':
          var x = $('.swal-content__input').val()
          x = x.trim()
          if (x == '') {
            swal('File Name Cannot be Empty')
          } else {
            var a = window.document.createElement('a')
            a.href = window.URL.createObjectURL(
              new Blob([codemirrorEditor.getValue()], { type: 'text/plain' }),
            )
            a.download = x + '.txt'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }
          break
      }
    })
  })

  // sweet alert (success)
  $('#sweetsuccess').on('click', function () {
    Swal.fire({
        title: "Success",
        text: "We have recorded your feedback. Thank you!",
        icon: "success",
        button: "OK",
    });

    let editorval = editor.getValue().trim();
    let promptval = $('#elemprompt').val().trim();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/addToTrainingSet', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        // record response
    };
    xhr.send('prompt1='+promptval+'&editor1='+editorval);
  })

  // sweet alert (success)
  $('#sweetdanger').on('click', function () {
    Swal.fire({
        title: "Incorrect Code Generated",
        text: "We have recorded your feedback. Thank you!",
        icon: "warning",
        button: "OK",
    });
  })

  let ec1 = `const light = new Entity()
light.addComponent(new Transform({ position: new Vector3(5, 5, 5) }))
light.addComponent(new DirectionalLight())
engine.addEntity(light)

const cube = new Entity()
cube.addComponent(new BoxShape())
cube.addComponent(new Transform({
position: new Vector3(5, 1, 5),
rotation: Quaternion.Euler(45, 45, 45)
}))
cube.addComponent(new Material())
engine.addEntity(cube)

const shadow = new Entity()
shadow.addComponent(new PlaneShape())
shadow.addComponent(new Transform({
position: new Vector3(5, 0, 5),
rotation: Quaternion.Euler(90, 0, 0)
}))
shadow.addComponent(new ShadowPlane({
alpha: 0.5,
visible: true,
width: 5,
height: 5
}))
engine.addEntity(shadow);`


let Ex21 = `import { engine, GltfContainer, InputAction, inputSystem, Material, MeshCollider, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'


import { bounceScalingSystem, circularSystem } from './systems'

import { setupUi } from './ui'
import { BounceScaling, Spinner } from './components'
import { createCube } from './factory'

engine.addSystem(circularSystem)
engine.addSystem(bounceScalingSystem)

export function main() {
  // draw UI
  setupUi()

  // fetch cube from Inspector
  const cube = engine.getEntityOrNullByName("Magic Cube")
  if (cube) {
    // Give the cube a color
    Material.setPbrMaterial(cube, { albedoColor: Color4.Blue() })

    // Make the cube spin, with the circularSystem
    Spinner.create(cube, { speed: 10 })

    // Give the cube a collider, to make it clickable
    MeshCollider.setBox(cube)

    // Add a click behavior to the cube, spawning new cubes in random places, and adding a bouncy effect for feedback
    pointerEventsSystem.onPointerDown(
      { entity: cube, opts: { button: InputAction.IA_POINTER, hoverText: "spawn" } },
      () => {
        createCube(1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8, false)
        BounceScaling.createOrReplace(cube)
      }
    )
  }

  createCube(5, 0, 5, false)
  createCube(5, 0, 6, false)

}
`;


let Ex2 = `const score = new Entity()
score.addComponent(new Transform({ position: new Vector3(2, 2, 2) }))
score.addComponent(new TextShape("0"))
engine.addEntity(score)

let points = 0

const collider = new Entity()
collider.addComponent(new BoxShape())
collider.addComponent(new Transform({ position: new Vector3(0, 1, 0) }))
collider.addComponent(
new OnClick(() => {
points++
score.getComponent(TextShape).value = points.toString()
})
)
engine.addEntity(collider)`;

  $('#generateCode').on('click', function () {

      let textval = $('#elemprompt').val().trim();
      if(textval.length < 4) {
              Swal.fire({
                  title: "Prompt is too short",
                  text: "Your prompt is too short for DCLBuilderAI to work.",
                  icon: "warning",
                  button: "OK",
              });
          return;
      }

     editorArray[0].setValue("Generating Code using DCLBuilderAI...");

     textval += " in decentraland";

     var xhr = new XMLHttpRequest();
     xhr.open('POST', '/generate', true);
     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     xhr.onload = function () {
       var data = JSON.parse(this.responseText).replaceAll("Code:", "").trimStart() + "\n";
       editorArray[0].setValue(data);
     };
     xhr.send('prompt1='+textval);
  })

  // $('#generateCodeB').on('click', function () {
  //
  //     let textval = $('#elemprompt').val().trim();
  //     if(textval.length < 4) {
  //             Swal.fire({
  //                 title: "Prompt is too short",
  //                 text: "Your prompt is too short for DCLBuilderAI to work.",
  //                 icon: "warning",
  //                 button: "OK",
  //             });
  //         return;
  //     }
  //
  //    editorArray[0].setValue("Generating Code using DCLBuilderAI...");
  //
  //    // setTimeout(() => {
  //    //   if (textval === 'Add shadow to entity') {
  //    //     editorArray[0].setValue(ec1);
  //    //   }
  //    // }, 4000);
  //    // return;
  //
  //    var xhr = new XMLHttpRequest();
  //    xhr.open('POST', '/generateB', true);
  //    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //    xhr.onload = function () {
  //      var data = JSON.parse(this.responseText).replaceAll("Code:", "").trimStart() + "\n";
  //      editorArray[0].setValue(data);
  //    };
  //    xhr.send('prompt1='+textval);
  // })

  $('#generateCodeC').on('click', function () {

      let textval = $('#elemprompt').val().trim();
      if(textval.length < 4) {
              Swal.fire({
                  title: "Prompt is too short",
                  text: "Your prompt is too short for DCLBuilderAI to work.",
                  icon: "warning",
                  button: "OK",
              });
          return;
      }

     editorArray[0].setValue("Generating Code using DCLBuilderAI...");

     // setTimeout(() => {
     //   if (textval === 'Add shadow to entity') {
     //     editorArray[0].setValue(ec1);
     //   }
     // }, 4000);
     // return;

     var xhr = new XMLHttpRequest();
     xhr.open('POST', '/generateC', true);
     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
     xhr.onload = function () {
       var data = JSON.parse(this.responseText).replaceAll("Code:", "").trimStart() + "\n";
       editorArray[0].setValue(data);
     };
     xhr.send('prompt1='+textval);
  })

  function loadLoader() {
    $(".load").show();
    setTimeout(() => {
      $(".load").hide();
    }, 60000);
  }

  let iframeSource = "/?position=0%2C0&PIPE_SCENE_CONSOLE=&DISABLE_backpack_editor_v2=&ENABLE_backpack_editor_v1";
  const iframe = document.getElementById("iframe");
    $('#previewBTN').on('click', function () {

      Swal.fire({
        title: 'Enter DCL Editor Port Below',
        input: 'number',
        inputAttributes: {
          min: 0,
          max: 1000000
        },
        showCancelButton: true,
        confirmButtonText: 'Preview',
        showLoaderOnConfirm: true,
      }).then((result) => {
        if (result.isConfirmed) {

          setTimeout(() => {
          }, 2000);

          loadLoader();
          $('#loadi iframe').attr('src', "http://localhost:" + result.value + iframeSource);

          iframe.style.display = "block";
           // calling loader anim when previewBtn clicked
        }
      })

      // iframe.style.display = "block";
      // //loadLoader(); // calling loader anim when previewBtn clicked
      // $('#loadi iframe').attr('src', iframeSource);
  })

  $('#generateCodeB').on('click', function () {
    iframe.style.display = "block";
    //loadLoader(); // calling loader anim when previewBtn clicked
    $('#loadi iframe').attr('src', iframeSource);
})

})
