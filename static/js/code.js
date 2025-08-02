/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

Code.workspace = Blockly.inject(document.getElementById("content_blocks"), { toolbox: document.getElementById("toolbox") });
Code.workspace.addChangeListener(Code.renderContent);

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
    var content = document.getElementById("code_menu").selected;
  // Initialize the pane.
  if (content == 'javascript') {
    Code.attemptCodeGeneration(Blockly.JavaScript);
  } else if (content == 'python') {
    Code.attemptCodeGeneration(Blockly.Python);
  } else if (content == 'cake') {
      Code.attemptCodeGeneration(Blockly.cake);
  } else if (content== 'php') {
    Code.attemptCodeGeneration(Blockly.PHP);
  } else if (content== 'dart') {
    Code.attemptCodeGeneration(Blockly.Dart);
  } else if (content== 'lua') {
    Code.attemptCodeGeneration(Blockly.Lua);
  }
  //if (typeof PR == 'object') {
  //  PR.prettyPrint();
  //}
};

/**
 * Attempt to generate the code and display it in the UI, pretty printed.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.attemptCodeGeneration = function(generator) {
 //var content = document.getElementById('content_' + Code.selected);
  var content = document.getElementById('target_code');
  content.textContent = '';
  if (Code.checkAllGeneratorFunctionsDefined(generator)) {
    var code = generator.workspaceToCode(Code.workspace);
    content.textContent = code;
    // Remove the 'prettyprinted' class, so that Prettify will recalculate.
    //content.className = content.className.replace('prettyprinted', '');
  }
};

/**
 * Check whether all blocks in use have generator functions.
 * @param generator {!Blockly.Generator} The generator to use.
 */
Code.checkAllGeneratorFunctionsDefined = function(generator) {
  var blocks = Code.workspace.getAllBlocks(false);
  var missingBlockGenerators = [];
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (!generator[blockType]) {
      if (missingBlockGenerators.indexOf(blockType) == -1) {
        missingBlockGenerators.push(blockType);
      }
    }
  }

  var valid = missingBlockGenerators.length == 0;
  if (!valid) {
    var msg = 'The generator code for the following blocks not specified for ' +
        generator.name_ + ':\n - ' + missingBlockGenerators.join('\n - ');
    Blockly.alert(msg);  // Assuming synchronous. No callback.
  }
  return valid;
};



  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25,
           length: 3,
           colour: '#ccc',
           snap: true},
       media: 'media/',
       rtl: rtl,
       toolbox: toolboxXml,
       zoom:
           {controls: true,
            wheel: true}
      });



/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = 'checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks(false).length;
  if (count < 2 ||
      window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function () {
    
    
    // TODO: Clean up the message files so this is done explicitly instead of
    // through this for-loop.
    for (var messageKey in MSG) {
        if (messageKey.indexOf('cat') == 0) {
            Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
        }
    }

    // Construct the toolbox XML, replacing translated variable names.
    var toolboxText = document.getElementById('toolbox').outerHTML;
    toolboxText = toolboxText.replace(/(^|[^%]){(\w+)}/g,
        function (m, p1, p2) { return p1 + MSG[p2]; });
    var toolboxXml = Blockly.Xml.textToDom(toolboxText);

    Code.workspace = Blockly.inject('content_blocks',
        {
            grid:
               {
                   spacing: 25,
                   length: 3,
                   colour: '#ccc',
                   snap: true
               },
            media: 'media/',
            rtl: rtl,
            toolbox: toolboxXml,
            zoom:
                {
                    controls: true,
                    wheel: true
                }
        });

};
function start() {
    Code.init;
}
//window.addEventListener('load', Code.init);
