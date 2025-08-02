/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Blocks for Blockly's Block Factory application.
 */
'use strict';



Blockly.Blocks['factory_base'] = {
  // Base of new block.
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendField('name')
        .appendField(new Blockly.FieldTextInput('block_type'), 'NAME');
    this.appendStatementInput('INPUTS')
        .setCheck('Input')
        .appendField('inputs');
    var dropdown = new Blockly.FieldDropdown([
        ['automatic inputs', 'AUTO'],
        ['external inputs', 'EXT'],
        ['inline inputs', 'INT']]);
    this.appendDummyInput()
        .appendField(dropdown, 'INLINE');
    dropdown = new Blockly.FieldDropdown([
        ['no connections', 'NONE'],
        ['鈫?left output', 'LEFT'],
        ['鈫?top+bottom connections', 'BOTH'],
        ['鈫?top connection', 'TOP'],
        ['鈫?bottom connection', 'BOTTOM']],
        function(option) {
          this.getSourceBlock().updateShape_(option);
          // Connect a shadow block to this new input.
          this.getSourceBlock().spawnOutputShadow_(option);
        });
    this.appendDummyInput()
        .appendField(dropdown, 'CONNECTIONS');
    this.appendValueInput('TOOLTIP')
        .setCheck('String')
        .appendField('tooltip');
    this.appendValueInput('HELPURL')
        .setCheck('String')
        .appendField('help url');
    this.appendValueInput('COLOUR')
        .setCheck('Colour')
        .appendField('colour');
    this.setTooltip('Build a custom block by plugging\n' +
        'fields, inputs and other blocks here.');
    this.setHelpUrl(
        'https://developers.google.com/blockly/guides/create-custom-blocks/block-factory');
  },
  mutationToDom: function() {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('connections', this.getFieldValue('CONNECTIONS'));
    return container;
  },
  domToMutation: function(xmlElement) {
    var connections = xmlElement.getAttribute('connections');
    this.updateShape_(connections);
  },
  spawnOutputShadow_: function(option) {
    // Helper method for deciding which type of outputs this block needs
    // to attach shadow blocks to.
    switch (option) {
      case 'LEFT':
        this.connectOutputShadow_('OUTPUTTYPE');
        break;
      case 'TOP':
        this.connectOutputShadow_('TOPTYPE');
        break;
      case 'BOTTOM':
        this.connectOutputShadow_('BOTTOMTYPE');
        break;
      case 'BOTH':
        this.connectOutputShadow_('TOPTYPE');
        this.connectOutputShadow_('BOTTOMTYPE');
        break;
    }
  },
  connectOutputShadow_: function(outputType) {
    // Helper method to create & connect shadow block.
    var type = this.workspace.newBlock('type_null');
    type.setShadow(true);
    type.outputConnection.connect(this.getInput(outputType).connection);
    if (this.rendered) {
      type.initSvg();
      type.render();
    }
  },
  updateShape_: function(option) {
    var outputExists = this.getInput('OUTPUTTYPE');
    var topExists = this.getInput('TOPTYPE');
    var bottomExists = this.getInput('BOTTOMTYPE');
    if (option === 'LEFT') {
      if (!outputExists) {
        this.addTypeInput_('OUTPUTTYPE', 'output type');
      }
    } else if (outputExists) {
      this.removeInput('OUTPUTTYPE');
    }
    if (option === 'TOP' || option === 'BOTH') {
      if (!topExists) {
        this.addTypeInput_('TOPTYPE', 'top type');
      }
    } else if (topExists) {
      this.removeInput('TOPTYPE');
    }
    if (option === 'BOTTOM' || option === 'BOTH') {
      if (!bottomExists) {
        this.addTypeInput_('BOTTOMTYPE', 'bottom type');
      }
    } else if (bottomExists) {
      this.removeInput('BOTTOMTYPE');
    }
  },
  addTypeInput_: function(name, label) {
    this.appendValueInput(name)
        .setCheck('Type')
        .appendField(label);
    this.moveInputBefore(name, 'COLOUR');
  }
};

var FIELD_MESSAGE = 'fields %1 %2';
var FIELD_ARGS = [
  {
    "type": "field_dropdown",
    "name": "ALIGN",
    "options": [['left', 'LEFT'], ['right', 'RIGHT'], ['centre', 'CENTRE']],
  },
  {
    "type": "input_statement",
    "name": "FIELDS",
    "check": "Field"
  }
];

var TYPE_MESSAGE = 'type %1';
var TYPE_ARGS = [
  {
    "type": "input_value",
    "name": "TYPE",
    "check": "Type",
    "align": "RIGHT"
  }
];

Blockly.Blocks['input_value'] = {
  // Value input.
  init: function() {
    this.jsonInit({
      "message0": "value input %1 %2",
      "args0": [
        {
          "type": "field_input",
          "name": "INPUTNAME",
          "text": "NAME"
        },
        {
          "type": "input_dummy"
        }
      ],
      "message1": FIELD_MESSAGE,
      "args1": FIELD_ARGS,
      "message2": TYPE_MESSAGE,
      "args2": TYPE_ARGS,
      "previousStatement": "Input",
      "nextStatement": "Input",
      "colour": 210,
      "tooltip": "A value socket for horizontal connections.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=71"
    });
  },
  onchange: function() {
    inputNameCheck(this);
  }
};
Blockly.Blocks['input_object'] = {
    // Statement input.
    init: function() {
        this.jsonInit({
            "message0": "statement input %1 %2",
            "args0": [
              {
                  "type": "field_input",
                  "name": "INPUTNAME",
                  "text": "NAME"
              },
              {
                  "type": "input_dummy"
              },
            ],
            "message1": FIELD_MESSAGE,
            "args1": FIELD_ARGS,
            "message2": TYPE_MESSAGE,
            "args2": TYPE_ARGS,
            "previousStatement": "Input",
            "nextStatement": "Input",
            "colour": 210,
            "tooltip": "A statement socket for enclosed vertical stacks.",
            "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=246"
        });
    },
    onchange: function() {
        inputNameCheck(this);
    }
};
Blockly.Blocks['properties_join'] = {
    // Statement object.
    init: function() {
        this.appendDummyInput()
              .appendField(new Blockly.FieldLabelSerializable("对象名"), "TEXT_NAME")
              .appendField(new Blockly.FieldTextInput("myObj"), "TEXT_INPUT");
        this.jsonInit({
        message0:"",
        output:"String",
        style:"text_blocks",
        tooltip:"该对象可以将各个属性组合在一起.",
        mutator:"text_join_mutator"
        });
    },
    onchange: function() {
        inputNameCheck(this);
    }
};

Blockly.Blocks['input_statement'] = {
  // Statement input.
  init: function() {
    this.jsonInit({
        "message0": '属性1 %1%2',
        "args0": [
          {
              "type": "input_value",
              "name": "VALUE",
              "check": "String"
          }
        ],
        "message1": '属性2 %1%2',
        "args1": [
          {
              "type": "input_value",
              "name": "VALUE",
              "check": "String"
          }
        ],
        "message2": '属性3： %1',
        "args2": [
          {
              "type": "input_value",
              "name": "VALUE",
              "check": "String"
          }
        ],
        "output": "text",
        "colour": 160,
        "tooltip": "返回含属性值的对象.",
        "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
    });
  },
  onchange: function() {
    inputNameCheck(this);
  }
};

Blockly.Blocks['input_dummy'] = {
  // Dummy input.
  init: function() {
    this.jsonInit({
      "message0": "dummy input",
      "message1": FIELD_MESSAGE,
      "args1": FIELD_ARGS,
      "previousStatement": "Input",
      "nextStatement": "Input",
      "colour": 210,
      "tooltip": "For adding fields without any block connections." +
                 "Alignment options (left, right, centre) only affect " +
                 "multi-row blocks.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=293"
    });
  }
};

Blockly.Blocks['input_end_row'] = {
  // End-row input.
  init: function() {
    this.jsonInit({
      "message0": "end-row input",
      "message1": FIELD_MESSAGE,
      "args1": FIELD_ARGS,
      "previousStatement": "Input",
      "nextStatement": "Input",
      "colour": 210,
      "tooltip": "For adding fields without any block connections that will " +
                 "be rendered on a separate row from any following inputs. " +
                 "Alignment options (left, right, centre) only affect " +
                 "multi-row blocks.",
      "helpUrl": "https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#block_inputs"
    });
  }
};

Blockly.Blocks['field_static'] = {
  // Text value.
  init: function() {
    this.setColour(160);
    this.appendDummyInput('FIRST')
        .appendField('text')
        .appendField(new Blockly.FieldTextInput(''), 'TEXT');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static text that serves as a label.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=88');
  },
};

Blockly.Blocks['field_label_serializable'] = {
  // Text value that is saved to XML.
  init: function() {
    this.setColour(160);
    this.appendDummyInput('FIRST')
        .appendField('text')
        .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static text that serves as a label, and is saved to' +
      ' XML. Use only if you want to modify this label at runtime.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=88');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_input'] = {
  // Text input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('text input')
        .appendField(new Blockly.FieldTextInput('default'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter text.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=319');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_number'] = {
  // Numeric input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('numeric input')
        .appendField(new Blockly.FieldNumber(0), 'VALUE')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.appendDummyInput()
        .appendField('min')
        .appendField(new Blockly.FieldNumber(-Infinity), 'MIN')
        .appendField('max')
        .appendField(new Blockly.FieldNumber(Infinity), 'MAX')
        .appendField('precision')
        .appendField(new Blockly.FieldNumber(0, 0), 'PRECISION');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter a number.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=319');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_angle'] = {
  // Angle input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('angle input')
        .appendField(new Blockly.FieldAngle('90'), 'ANGLE')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('An input field for the user to enter an angle.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=372');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};
Blockly.Blocks['imagestest'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("images/car.jpg",45,40,{ alt: "*", flipRtl: "FALSE" }));
    this.setColour(255);
 this.setTooltip("");this.setOutput(true, null);
 this.setHelpUrl("");
  }
};
Blockly.Blocks['field_dropdown'] = {
  // Dropdown menu.
  init: function() {
    this.appendDummyInput()
        .appendField('dropdown')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.optionList_ = ['text', 'text', 'text'];
    this.updateShape_();
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setMutator(new Blockly.icons.MutatorIcon(
        ['field_dropdown_option_text', 'field_dropdown_option_image'], this));
    this.setColour(160);
    this.setTooltip('Dropdown menu with a list of options.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
  },
  mutationToDom: function(workspace) {
    // Create XML to represent menu options.
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('options', JSON.stringify(this.optionList_));
    return container;
  },
  domToMutation: function(container) {
    // Parse XML to restore the menu options.
    var value = JSON.parse(container.getAttribute('options'));
    if (typeof value === 'number') {
      // Old format from before images were added.  November 2016.
      this.optionList_ = [];
      for (var i = 0; i < value; i++) {
        this.optionList_.push('text');
      }
    } else {
      this.optionList_ = value;
    }
    this.updateShape_();
  },
  decompose: function(workspace) {
    // Populate the mutator's dialog with this block's components.
    var containerBlock = workspace.newBlock('field_dropdown_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.optionList_.length; i++) {
      var optionBlock = workspace.newBlock(
          'field_dropdown_option_' + this.optionList_[i]);
      optionBlock.initSvg();
      connection.connect(optionBlock.previousConnection);
      connection = optionBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Reconfigure this block based on the mutator dialog's components.
    var optionBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    this.optionList_.length = 0;
    var data = [];
    while (optionBlock) {
      if (optionBlock.type === 'field_dropdown_option_text') {
        this.optionList_.push('text');
      } else if (optionBlock.type === 'field_dropdown_option_image') {
        this.optionList_.push('image');
      }
      data.push([optionBlock.userData_, optionBlock.cpuData_]);
      optionBlock = optionBlock.nextConnection &&
          optionBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // Restore any data.
    for (var i = 0; i < this.optionList_.length; i++) {
      var userData = data[i][0];
      if (userData !== undefined) {
        if (typeof userData === 'string') {
          this.setFieldValue(userData || 'option', 'USER' + i);
        } else {
          this.setFieldValue(userData.src, 'SRC' + i);
          this.setFieldValue(userData.width, 'WIDTH' + i);
          this.setFieldValue(userData.height, 'HEIGHT' + i);
          this.setFieldValue(userData.alt, 'ALT' + i);
        }
        this.setFieldValue(data[i][1] || 'OPTIONNAME', 'CPU' + i);
      }
    }
  },
  saveConnections: function(containerBlock) {
    // Store all data for each option.
    var optionBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (optionBlock) {
      optionBlock.userData_ = this.getUserData(i);
      optionBlock.cpuData_ = this.getFieldValue('CPU' + i);
      i++;
      optionBlock = optionBlock.nextConnection &&
          optionBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Delete everything.
    var i = 0;
    while (this.getInput('OPTION' + i)) {
      this.removeInput('OPTION' + i);
      this.removeInput('OPTION_IMAGE' + i, true);
      i++;
    }
    // Rebuild block.
    var src = 'https://www.gstatic.com/codesite/ph/images/star_on.gif';
    for (var i = 0; i <= this.optionList_.length; i++) {
      var type = this.optionList_[i];
      if (type === 'text') {
        this.appendDummyInput('OPTION' + i)
            .appendField('鈥?')
            .appendField(new Blockly.FieldTextInput('option'), 'USER' + i)
            .appendField(',')
            .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU' + i);
      } else if (type === 'image') {
        this.appendDummyInput('OPTION' + i)
            .appendField('鈥?')
            .appendField('image')
            .appendField(new Blockly.FieldTextInput(src), 'SRC' + i);
        this.appendDummyInput('OPTION_IMAGE' + i)
            .appendField(' ')
            .appendField('width')
            .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'WIDTH' + i)
            .appendField('height')
            .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'HEIGHT' + i)
            .appendField('alt text')
            .appendField(new Blockly.FieldTextInput('*'), 'ALT' + i)
            .appendField(',')
            .appendField(new Blockly.FieldTextInput('OPTIONNAME'), 'CPU' + i);
      }
    }
  },
  onchange: function() {
    if (this.workspace && this.optionList_.length < 1) {
      this.setWarningText('Drop down menu must\nhave at least one option.');
    } else {
      fieldNameCheck(this);
    }
  },
  getUserData: function(n) {
    if (this.optionList_[n] === 'text') {
      return this.getFieldValue('USER' + n);
    }
    if (this.optionList_[n] === 'image') {
      return {
        src: this.getFieldValue('SRC' + n),
        width: Number(this.getFieldValue('WIDTH' + n)),
        height: Number(this.getFieldValue('HEIGHT' + n)),
        alt: this.getFieldValue('ALT' + n)
      };
    }
    throw 'Unknown dropdown type';
  }
};

Blockly.Blocks['field_dropdown_container'] = {
  // Container.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('add options');
    this.appendStatementInput('STACK');
    this.setTooltip('Add, remove, or reorder options\n' +
                    'to reconfigure this dropdown menu.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};

Blockly.Blocks['field_dropdown_option_text'] = {
  // Add text option.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('文本类数据集')
        .appendField(new Blockly.FieldDropdown([
            ['none', 'none'],['datasets/text/1.csv', 'datasets/text/1.csv'],
        ['datasets/text/2.csv', 'datasets/text/2.csv'],
        ['datasets/text/3.csv', 'datasets/text/3.csv']
        ]), 'FIELDNAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('数据集存放在datasets下text文件夹中.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};
Blockly.Python['field_dropdown_option_text'] = function(block) {
    var text_text = block.getFieldValue('FIELDNAME');
    var code = text_text + '\n'; // 示例代码生成逻辑
    return code;
};

Blockly.Blocks['field_dropdown_option_image'] = {
  // Add image option.
  init: function() {
    this.setColour(160);
    var input = this.appendDummyInput()
        .appendField('图像类数据集');
    var options = [
        ['none', 'NONE'],
        [{'src': 'datasets/images/1.png', 'width': 50, 'height': 25, 'alt': 'Canada'}, 'datasets/images/1.png'],
        [{'src': 'datasets/images/2.png', 'width': 50, 'height': 25, 'alt': 'USA'}, 'datasets/images/2.png'],
        [{'src': 'datasets/images/3.png', 'width': 50, 'height': 25, 'alt': 'Mexico'}, 'datasets/images/3.png']
    ];
    input.appendField(new Blockly.FieldDropdown(options), 'FIELDNAME');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('数据集存放在datasets下images文件夹中.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=386');
    this.contextMenu = false;
  }
};
Blockly.Python['field_dropdown_option_image'] = function(block) {
    var text_text = block.getFieldValue('FIELDNAME');
    var code = text_text + '\n'; // 示例代码生成逻辑
    return code;
};

Blockly.Blocks['open_file'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("打开文件");
        this.setOutput(true, "String"); // 假设输出是文本类型
        this.setColour(230); // 设置颜色
        this.setTooltip(''); // 设置提示信息
        this.setHelpUrl(''); // 设置帮助链接
    }
};

Blockly.JavaScript['custom_object'] = function(block) {
    var objname = block.getFieldValue('objectname');
    var value='';
    var pname='';
    var str=objname+'.';
    for (var i=1; i<6; i=i+1) {
        pname=block.getFieldValue('name'+i);
        if (pname=='none'|| pname=='') break;
        value=value+str+pname+'='+block.getFieldValue('value'+i)+';\n';
    }
    for (var i=1; i<3; i=i+1) {
        pname=block.getFieldValue('funname'+i);
        if (pname=='none'|| pname=='') break;
        value=value+str+pname+'();\n';
    }
    //value=value+";\n";
    return value;
};
Blockly.Python['custom_object'] = function(block) {
    var objname = block.getFieldValue('objectname');
    var value='';
    var pname='';
    var str=objname+'.';
    for (var i=1; i<6; i=i+1) {
        pname=block.getFieldValue('name'+i);
        if (pname=='none'|| pname=='') break;
        value=value+str+pname+'='+block.getFieldValue('value'+i)+'\n';
    }
    for (var i=1; i<3; i=i+1) {
        pname=block.getFieldValue('funname'+i);
        if (pname=='none'|| pname=='') break;
        value=value+str+pname+'()\n';
    }

    return value;
};
Blockly.JavaScript['open_file'] = function(block) {
    var code = 'openFile(${block.getFieldValue("FILE")});'; // 假设你已经有了一个openFile函数定义在别处
    return [code, Blockly.JavaScript.ORDER_ATOMIC]; // 返回JavaScript代码和顺序类型
};
Blockly.Blocks['js_function_expression'] = {
    /**
     * Block for redering a function expression.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(290);
        this.appendDummyInput()
            .appendField("function");
        this.appendValueInput('NAME');
        this.appendValueInput('PARAM0')
            .appendField("(");
        this.appendDummyInput('END')
            .appendField(")");
        this.appendStatementInput('STACK');
        this.setInputsInline(true);

        this.setTooltip('Function expression.');


        this.setOutput(true);
    }
};

Blockly.Python['messagebox'] = function(block) {
    var op = block.getFieldValue('op');
    var opmessage = block.getFieldValue('opmessage');
    var value='from tkinter import messagebox\n\n';

    if (op=='showinfo'){
        value=value+'messagebox.'+op+'("信息", "'+opmessage+'")\n';
    }else if(op=='showwarning'){
        value=value+'messagebox.'+op+'("警告", "'+opmessage+'")\n';
    }else if (op=='askokcancel'){
        value=value+'result =messagebox.'+op+'("确认", "'+opmessage+'")\n';
    }
    return value;
};
Blockly.Python['ai_framework'] = function(block) {
    var sframework = block.getFieldValue('NAME');

    var value='';

    if (sframework=='Pytorch'){
        value=value+'import torch\n';
        value=value+'import torch.nn as nn\n';
        value=value+'import torch.optim as optim\n';
        value=value+'import torchvision\n';
        value=value+'import torchvision.transforms as transforms\n';
        value=value+'from torch.utils.data import DataLoader, random_split\n';
        value=value+'import matplotlib.pyplot as plt\n\n';
    }
    else if (sframework=='Keras'){
        value=value+'import tensorflow as tf\n';
        value=value+'from tensorflow import keras\n';
        value=value+'from tensorflow.keras.models import load_model\n';
        value=value+'from tensorflow.keras import layers, models\n';
        value=value+'import matplotlib.pyplot as plt\n';
        value=value+'import numpy as np\n';
        value=value+'import time\n\n';

    }
    else if (sframework=='Scikit-Learn'){
    value=value+'import os\n';
    value=value+'import pickle\n';
    value=value+'from tqdm import tqdm\n';
    value=value+'import re\n';
    value=value+'import jieba\n';
    value=value+'from gensim.models import Word2Vec\n';
        value=value+'import numpy as np\n';
        value=value+'import sklearn\n';
        value=value+'from urllib.request import urlretrieve\n';
        value=value+'from sklearn.metrics import classification_report\n';
        value=value+'from sklearn.metrics import accuracy_score\n';
        value=value+'from sklearn.model_selection import train_test_split\n';
        value=value+'from sklearn.metrics import mean_squared_error,r2_score\n';
        value=value+'from sklearn.preprocessing import StandardScaler\n';
        value=value+'import matplotlib.pyplot as plt\n\n';
        value=value+'from sklearn.decomposition import PCA\n';
value=value+'from sklearn import svm, metrics\n';
value=value+'from sklearn.model_selection import train_test_split\n';
    } else if (sframework=='AlexNet5'){
        value=value+'import tensorflow as tf\n';
        value=value+'import os\n';
        value=value+'import numpy as np\n';
        value=value+'from tensorflow.keras.models import Sequential\n';
        value=value+'from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout\n';
        value=value+'from tensorflow.keras.models import Model\n';
        value=value+'from tensorflow.keras.preprocessing.image import ImageDataGenerator\n';
        value=value+'from tensorflow.keras.optimizers import Adam\n\n';
    } else if (sframework=='OpenCV'){
        value=value+'import os\n';
        value=value+'import cv2\n';
        value=value+'import numpy as np\n';
        value=value+'import tensorflow as tf\n';
        value=value+'from tensorflow.keras import layers, models\n';
        value=value+'from tensorflow.keras.preprocessing.image import ImageDataGenerator\n';
    }else if (sframework=='Zebra'){
        value=value+'#单元1.导入库和配置参数\n';
        value=value+'import os\n';
        value=value+'import cv2\n';
        value=value+'import numpy as np\n';
        value=value+'import xml.etree.ElementTree as ET\n';
        value=value+'from sklearn.model_selection import train_test_split\n';
        value=value+'import tensorflow as tf\n';
        value=value+'from keras import layers, models, optimizers\n';
        value=value+'import matplotlib.pyplot as plt\n';
        value=value+'# 配置参数\n';
        value=value+"DATA_PATH = r'./zebra_data'\n";
        value=value+"TEST_IMG_PATH = r'./zebra_data/test/8.png'  # 测试图片路径\n";
        value=value+'IMG_SIZE = 128\n';
        value=value+'BATCH_SIZE = 16\n';
        value=value+'EPOCHS = 15\n';
    }else if(sframework=='Cat_or_dog'){
        value=value+'import tensorflow as tf\n';
        value=value+'import cv2\n';
        value=value+'import numpy as np\n';
        value=value+'import matplotlib.pyplot as plt\n';
        value=value+'import os\n';
        value=value+'             \n';
        value=value+'# 参数设置\n';
        value=value+'IMG_SIZE = 128\n';
        value=value+'BASE_DIR = os.path.dirname(__file__)  # 当前.py文件的目录\n';
        value=value+"MODEL_PATH = os.path.join(BASE_DIR, 'cat_dog_cnn_model.h5')\n";
        value=value+"#MODEL_PATH = 'cat_dog_cnn_model.h5'  # 训练好的猫狗模型\n";
        value=value+"IMAGE_PATH = 'test_images/test_cat_or_dog.png'  # 测试图像路径\n";
    }else if (sframework=='ASR'){
      value=value+'# 1. 导入框架和库\n';
        value=value+'from utils import *\n';
value=value+'from sklearn.mixture import GaussianMixture\n';
value=value+'import os\n';
value=value+'import numpy as np\n';
value=value+'import warnings\n';
value=value+'import librosa\n\n';
    }
    else{
        value=value+"import "+sframework+'\n';
    }

    return value;
};
Blockly.Python['ai_import'] = function(block) {
    var fromfwork = block.getFieldValue('fromfwork');
    var importname = block.getFieldValue('importname');
    var asname = block.getFieldValue('asname');
    var value='';
    var i=0;
    if (fromfwork!='none'&&fromfwork!=''){
        value=value+'from '+fromfwork;i=1;
    }
    if (importname!='none'&&importname!=''){
        if (i==1){
            value=value+' import '+importname;i=1;
        }
        else{
            value=value+'import '+importname;i=1;
        }
    }
    if (asname!='none'&&asname!=''&&i==1){
        value=value+' as '+asname;}
    value=value+'\n';
    return value;

}
Blockly.Python['ai_datasetfrompath'] = function(block) {
    var sframework = block.getFieldValue('NAME');
    var dataset=block.getFieldValue('datasetname');
    var train_path=block.getFieldValue('train_path');
    var val_path=block.getFieldValue('val_path');
    var test_path=block.getFieldValue('test_path');
    var imgsize=block.getFieldValue('IMG_SIZE');
    var batchsize=block.getFieldValue('BATCH_SIZE');
    var epochs0=block.getFieldValue('EPOCHS');
    var value='';
    if (dataset=='zebra'){
        value=value+'# 数据集路径\n';
        value=value+'TRAIN_DIR = \"'+train_path+'\"\n';
        value=value+'VAL_DIR = \"'+val_path+'\"\n\n';

        value=value+'# 基础配置\n';
        value=value+'IMG_SIZE = '+imgsize+'# 图片尺寸\n';
        value=value+'BATCH_SIZE = '+batchsize+'# 批次大小\n';
        value=value+'EPOCHS = '+epochs0+'# 迭代次数\n';
        value=value+'# 数据预处理\n';
        value=value+'train_datagen = ImageDataGenerator(rescale=1. / 255)\n';
        value=value+'val_datagen = ImageDataGenerator(rescale=1. / 255)\n';

        value=value+'train_generator = train_datagen.flow_from_directory(\n';
        value=value+'   TRAIN_DIR,\n';
        value=value+'    target_size=(IMG_SIZE, IMG_SIZE),\n';
        value=value+'    batch_size=BATCH_SIZE,\n';
        value=value+'    class_mode=\'binary\'\n';
        value=value+')\n';

        value=value+'val_generator = val_datagen.flow_from_directory(\n';
        value=value+'    VAL_DIR,\n';
        value=value+'    target_size=(IMG_SIZE, IMG_SIZE),\n';
        value=value+'    batch_size=BATCH_SIZE,\n';
        value=value+'    class_mode=\'binary\',\n';
        value=value+'    shuffle=False\n';
        value=value+')\n';
    }
    return value;
};
Blockly.Python['ai_dataset'] = function(block) {
    var sframework = block.getFieldValue('NAME');
    var dataset=block.getFieldValue('datasetname');
    var train_size=block.getFieldValue('train_size');
    var val_size=block.getFieldValue('val_size');
    var test_size=block.getFieldValue('test_size');
    var value='';
    if (dataset=='california'){
        value=value+'#导内置加州房价数据集包\n';
        value=value+'from sklearn.datasets import fetch_california_housing\n\n';

        value=value+'# 加载数据集\n';
        value=value+'california = fetch_california_housing()\n';
        value=value+'X = california.data,y = california.target\n';

        value=value+'# 分割数据集为训练集和测试集\n';
        value=value+'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size='+test_size+', random_state=42)\n';
    }else if (dataset=='iris'||dataset=='wine'||dataset=='digits'||dataset=='diabetes'){
        value=value+'from sklearn.datasets import  load_'+dataset+'\n\n';

        value=value+'ds = load_'+dataset+'()\n';
        value=value+'X, y = ds.data, ds.target[:, 0]\n';
        value=value+'# 分割数据集为训练集和测试集\n';
        value=value+'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size='+test_size+', random_state=42)\n';
    }
    else  if (dataset=='mnist'){
        if (sframework=='AlexNet5'){
            value=value+'# 数据预处理\n';
            value=value+'train_datagen = ImageDataGenerator(rescale=1./255, shear_range=0.2, zoom_range=0.2, horizontal_flip=True)\n';
            value=value+'test_datagen = ImageDataGenerator(rescale=1./255)\n';

            value=value+'train_generator = train_datagen.flow_from_directory(\n';
            value=value+'\'data/train\',\n';
            value=value+'target_size=(224, 224),  # AlexNet的输入尺寸是224x224\n';
            value=value+'batch_size=32,\n';
            value=value+'class_mode=\'binary\'\n';
            value=value+')\n';

            value=value+'validation_generator = test_datagen.flow_from_directory(\n';
            value=value+'\'data/test\',\n';
            value=value+'target_size=(224, 224),\n';
            value=value+'batch_size=32,\n';
            value=value+'class_mode=\'binary\'\n';
            value=value+')\n';
        }
        else if (sframework=='Keras'){
            value=value+'# 超参数设置\n';
            value=value+'params = {\n';
            value=value+'    "learning_rate": 0.01,\n';
            value=value+'    "num_epochs": 10,\n';
            value=value+'    "batch_size": 64,\n';
            value=value+'    "train_size": 50000,\n';
            value=value+'    "val_size": 10000,\n';
            value=value+'    "test_size": 10000,\n';
            value=value+'    "hidden_nodes": 128\n';
            value=value+'}\n';
            value=value+'physical_devices = tf.config.list_physical_devices(\'GPU\')\n';
            value=value+'if physical_devices:\n';
            value=value+'    print(f"Number of GPUs available: {len(physical_devices)}")\n';
            value=value+'else:\n';
            value=value+'        print("No GPU found. Training will be done on CPU.")\n';
            value=value+'# 下载MNIST数据集并进行预处理\n';
            value=value+'(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()\n';

            value=value+'# 归一化到[-1, 1]\n';
            value=value+'x_train, x_test = x_train / 127.5 - 1, x_test / 127.5 - 1\n';

            value=value+'# 重新划分训练集和验证集\n';
            value=value+'x_val, y_val = x_train[params[\'train_size\']:], y_train[params[\'train_size\']:]\n';
            value=value+'x_train, y_train = x_train[:params[\'train_size\']], y_train[:params[\'train_size\']]\n';

            value=value+'# 展平输入数据\n';
            value=value+'x_train = x_train.reshape(-1, 28 * 28)\n';
            value=value+'x_val = x_val.reshape(-1, 28 * 28)\n';
            value=value+'x_test = x_test.reshape(-1, 28 * 28)\n';
        }
    }
    else if (dataset=='Linnerud'){
        value=value+'# 加载内置数据集Linnerud\n';
        value=value+'from sklearn.decomposition import PCA\n';
        value=value+'from sklearn.datasets import load_linnerud\n';
        value=value+'dataset = load_linnerud()\n';
        value=value+'\n';


    }
    else if (dataset=='catdog'){
        value=value+'# 数据预处理\n';
        value=value+'train_datagen = ImageDataGenerator(rescale=1./255, shear_range=0.2, zoom_range=0.2, horizontal_flip=True)\n';
        value=value+'test_datagen = ImageDataGenerator(rescale=1./255)\n';

        value=value+'train_generator = train_datagen.flow_from_directory(\n';
        value=value+'\'data/'+dataset+'/train\',\n';
        value=value+'target_size=(224, 224),  # AlexNet的输入尺寸是224x224\n';
        value=value+'batch_size=32,\n';
        value=value+'class_mode=\'binary\'\n';
        value=value+')\n';

        value=value+'validation_generator = test_datagen.flow_from_directory(\n';
        value=value+'\'data\/'+dataset+'\/test\',\n';
        value=value+'target_size=(224, 224),\n';
        value=value+'batch_size=32,\n';
        value=value+'class_mode=\'binary\'\n';
        value=value+')\n';
    }else if (dataset== 'Zebra'){
        value=value+'      # 单元2.加载数据集、数据预处理\n';
        value=value+'class ZebraDataset:\n';
        value=value+'    def __init__(self, data_dir):\n';
        value=value+'        self.data_dir = data_dir\n';
        value=value+'        self.samples = []\n';
        value=value+'                       \n';
        value=value+'        # 加载正样本（斑马线）\n';
        value=value+'        zebra_dir = os.path.join(data_dir, "zebra")\n';
        value=value+'        zebra_label_dir = os.path.join(data_dir, "zebra_label")\n';
        value=value+'        self._load_samples(zebra_dir, zebra_label_dir, is_positive=True)\n';
        value=value+'                         \n';
        value=value+'        # 加载负样本（其他）\n';
        value=value+'        others_dir = os.path.join(data_dir, "others")\n';
        value=value+'        others_label_dir = os.path.join(data_dir, "others_label")\n';
        value=value+'        self._load_samples(others_dir, others_label_dir, is_positive=False)\n';
        value=value+'                                 \n';
        value=value+'    def _load_samples(self, img_dir, label_dir, is_positive):\n';
        value=value+'        for img_name in os.listdir(img_dir):\n';
        value=value+'            if img_name.endswith(".png"):\n';
        value=value+'                img_path = os.path.join(img_dir, img_name)\n';
        value=value+'                xml_path = os.path.join(label_dir, img_name.replace(".png", ".xml"))\n';
        value=value+'                                               \n';
        value=value+'                if not os.path.exists(xml_path):\n';
        value=value+'                    continue\n';
        value=value+'                                  \n';
        value=value+'                tree = ET.parse(xml_path)\n';
        value=value+'                root = tree.getroot()\n';
        value=value+'                                \n';
        value=value+'                # 解析图像尺寸\n';
        value=value+'                size = root.find("size")\n';
        value=value+'                width = int(size.find("width").text)\n';
        value=value+'                height = int(size.find("height").text)\n';
        value=value+'                                 \n';
        value=value+'                # 检查是否存在目标\n';
        value=value+'                obj = root.find("object")\n';
        value=value+'                if is_positive:\n';
        value=value+'                    # 正样本必须包含有效标注\n';
        value=value+'                    if obj is not None:\n';
        value=value+'                        bndbox = obj.find("bndbox")\n';
        value=value+'                        coords = [int(bndbox.find(tag).text) for tag in ["xmin", "ymin", "xmax", "ymax"]]\n';
        value=value+'                        self.samples.append((img_path, [1] + coords, (width, height)))\n';
        value=value+'                else:\n';
        value=value+'                    # 负样本不应包含目标\n';
        value=value+'                    if obj is None:\n';
        value=value+'                        self.samples.append((img_path, [0, 0, 0, 0, 0], (width, height)))\n';
        value=value+'#数据预处理\n';
        value=value+'    def load_data(self):\n';
        value=value+'        images, labels = [], []\n';
        value=value+'        for img_path, label, (w, h) in self.samples:\n';
        value=value+'            img = cv2.imread(img_path)\n';
        value=value+'            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)\n';
        value=value+'                              \n';
        value=value+'            # 预处理\n';
        value=value+'            img = cv2.resize(img, (IMG_SIZE, IMG_SIZE)) / 255.0\n';
        value=value+'                                     \n';
        value=value+'            # 归一化坐标（仅正样本）\n';
        value=value+'            if label[0] == 1:\n';
        value=value+'                norm_coords = [\n';
        value=value+'                    label[1] / w, label[2] / h,\n';
        value=value+'                    label[3] / w, label[4] / h\n';
        value=value+'                ]\n';
        value=value+'                labels.append([1] + norm_coords)\n';
        value=value+'            else:\n';
        value=value+'                labels.append([0, 0, 0, 0, 0])\n';
        value=value+'                              \n';
        value=value+'            images.append(img)\n';
        value=value+'                                   \n';
        value=value+'        return np.array(images), np.array(labels)\n';
    }else if(dataset=='Cat_or_dog'){
    value=value+'# 从标签文件中加载图片和对应标签    \n';
    value=value+'def load_data(data_dir, label_file, target_size=(224, 224)):\n';
    value=value+'    images = []     \n';
    value=value+'    labels = [] \n';
    value=value+"    with open(os.path.join(data_dir, label_file), 'r') as f: \n";
    value=value+'        for line in f: \n';
    value=value+"            path, label = line.strip().split(',') \n";
    value=value+'            image_path = os.path.join(data_dir, path)  \n';
    value=value+'            image = tf.keras.preprocessing.image.load_img(image_path, target_size=target_size)\n';
    value=value+'            image = tf.keras.preprocessing.image.img_to_array(image)\n';
    value=value+'            images.append(image)\n';
    value=value+'            labels.append(int(label))\n';
    value=value+'    # 将图片数组归一化到 [0, 1]，同时将数据从列表转换为 NumPy 数组\n';
    value=value+"    images = np.array(images, dtype='float32') / 255.0  # 归一化图像\n";
    value=value+"    labels = np.array(labels, dtype='int32')  # 标签转为整数数组\n";
    value=value+'    return images, labels\n';
    value = value + '# 数据集所在的路径和标签文件\n';
value = value + "train_dir = 'C:\\sourcecode\\datasets\\catdog'\n";
value = value + "test_dir = 'C:\\sourcecode\\datasets\\catdog'\n";
value = value + "train_label_file = 'train.txt'\n";
value = value + "test_label_file = 'test.txt'\n";
value = value + '# 加载训练和验证数据\n';
value = value + 'train_images, train_labels = load_data(train_dir, train_label_file)\n';
value = value + 'test_images, test_labels = load_data(test_dir, test_label_file)\n';
//    value=value+'\n';
//    value=value+'\n';
//        value=value+'\n';
//        value=value+'# 图像预处理函数\n';
//        value=value+'def load_and_preprocess_image(img_path):\n';
//        value=value+'    img = cv2.imread(img_path)\n';
//        value=value+'    if img is None:\n';
//        value=value+'        raise FileNotFoundError(f"无法加载图像，请检查路径是否正确：{img_path}")\n';
//        value=value+'    # 显示原始图像（BGR转RGB以便matplotlib显示）\n';
//        value=value+'    img_rgb_original = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)\n';
//        value=value+'    plt.figure(figsize=(4, 4))\n';
//        value=value+'    plt.imshow(img_rgb_original)\n';
//        value=value+"    plt.axis('off')\n";
//        value=value+'    plt.title("Original Image")\n';
//        value=value+'    plt.savefig(\'output.png\')\n';
//        value=value+'    img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))\n';
//        value=value+'    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)\n';
//        value=value+'    img_normalized = img_rgb / 255.0\n';
//        value=value+'    # 显示预处理后的图像\n';
//        value=value+'    plt.figure(figsize=(4, 4))\n';
//        value=value+'    plt.imshow(img_rgb)\n';
//        value=value+"    plt.axis('off')\n";
//        value=value+'    plt.title("Preprocessed Image (Resized & Normalized)")\n';
//        value=value+'    plt.savefig(\'output1.png\')\n';
//        value=value+'    return np.expand_dims(img_normalized, axis=0), img_rgb\n';
    }else if (dataset=='ASR'){
      value=value+'# 2. 处理数据集\n';
value=value+'def mfcc(wav_path, delta=2):\n';
value=value+'    y, sr = librosa.load(wav_path)\n';
value=value+'    mfcc_feat = librosa.feature.mfcc(y = y, sr = sr, n_mfcc = 13)\n';
value=value+'    ans = [mfcc_feat]\n';
value=value+'    if delta >= 1:\n';
value=value+'        mfcc_delta1 = librosa.feature.delta(mfcc_feat, order = 1, mode = "nearest")\n';
value=value+'        ans.append(mfcc_delta1)\n';
value=value+'    if delta >= 2:\n';
value=value+'        mfcc_delta2 = librosa.feature.delta(mfcc_feat, order = 2, mode = "nearest")\n';
value=value+'        ans.append(mfcc_delta2)\n';
value=value+'    return np.transpose(np.concatenate(ans, axis = 0),[1,0])\n\n';
    }
    else{
        value=value+sframework+'\n';
    }
    return value;
};
Blockly.Python['ai_datasetfromfile'] = function(block){
    //var sframework = block.getFieldValue('NAME');
    var datapath=block.getFieldValue('datapath');
    var target=block.getFieldValue('target');
    var train_size=block.getFieldValue('train_size');
    var val_size=block.getFieldValue('val_size');
    var test_size=block.getFieldValue('test_size');
    var value='';
     value=value+'import pandas as pd\n';

     value=value+'# 1. 读取 CSV 文件\n';
     datapath=datapath.replace(/\\/g, '/');
     value=value+'dataset = pd.read_csv(\''+datapath+'\')\n';

     value=value+'# 获取所有的列名\n';
     value=value+'all_columns = dataset.columns.tolist()\n';
     value=value+'target_column = \''+target+'\'  # 获取类标列名\n\n';
//
//     value=value+'# 获取特征列名（排除目标列）\n';
//     value=value+'feature_columns = [col for col in all_columns if col != target_column]\n\n';
//
//     value=value+'# 2. 准备特征和目标数据\n';
//     value=value+'X= data[feature_columns]\n';
//     value=value+'y= data[target_column]\n';
//     value=value+'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size='+test_size+', random_state=42)\n';
     return value;
};
Blockly.Python['ai_buildmodel'] = function(block) {
    var buildmodel = block.getFieldValue('NAME');
    var value='';
    if (buildmodel=='custom'){
        value=value+'custom\n';
    }else if (buildmodel=='kmeans'){
        value=value+'from sklearn.cluster import KMeans\n\n';
        value=value+'# 选择用于聚类的特征列（排除CHANNEL和REGION）\n';
        value=value+"X = dataset[['Fresh', 'Milk', 'Grocery', 'Frozen', 'Detergents_Paper', 'Delicassen']] \n";
        value=value+'scaler = StandardScaler()\n';
        value=value+'X_scaled = scaler.fit_transform(X)\n';
        value=value+'# 初始化 KMeans 算法，设定聚类数量为 3（可以根据需要调整）\n';
        value=value+'kmeans = KMeans(n_clusters=3, random_state=42)\n\n';
        value=value+'kmeans.fit(X_scaled)  \n';
    }else if (buildmodel=='CNN') {
        value=value+'      # 构建简单CNN模型\n';
        value=value+'model = models.Sequential([\n';
        value=value+"    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),\n";
        value=value+'    layers.MaxPooling2D((2, 2)),\n';
        value=value+'    layers.Flatten(),\n';
        value=value+"    layers.Dense(64, activation='relu'),\n";
        value=value+"    layers.Dense(1, activation='sigmoid')\n";
        value=value+'])\n';
        value=value+'\n';
        value=value+"model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])\n";
        value=value+'\n';

    }else if (buildmodel=='LinearRegression'){
        value=value+'from sklearn.linear_model import LinearRegression\n\n';
        value=value+"feature_name = 'latitude'  # 线性回归不需要太多特征，这里是latitude或longitude\n";
        value=value+'# 初始化线性回归模型\n';
        value=value+'X = dataset[[feature_name]]\n';
        value=value+'y = dataset[[target_column]]\n';
        value=value+'\n';
        value=value+'# 将数据集拆分为训练集和测试集\n';
        value=value+'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n';
        value=value+'\n';
        value=value+'# 创建线性回归模型\n';
        value=value+'model = LinearRegression()\n';
    }
    else if (buildmodel=='LogisticRegression'){
        value=value+'from sklearn.linear_model import LogisticRegression\n\n';
        value=value+'# 初始化逻辑回归模型\n';
        value=value+'model = LogisticRegression(max_iter=1000)\n';
    }else if (buildmodel=='KNN'){
        value=value+'from sklearn.neighbors import KNeighborsClassifier\n\n';
        value=value+'# 创建并训练KNN分类器\n';
        value=value+'model = KNeighborsClassifier(n_neighbors=3)\n';
    }
    else if (buildmodel=='CART'){
        value=value+'from sklearn.tree import DecisionTreeRegressor\n\n';

        value=value+'# 创建CART决策树回模型\n';
        value=value+'model = DecisionTreeRegressor(random_state=42)\n';
    }
    else if (buildmodel=='FCNN'){
        value=value+'# 定义FCNN神经网络模型\n';
        value=value+'def build_model():\n';
        value=value+'   model = models.Sequential([\n';
        value=value+'    layers.Dense(params[\'hidden_nodes\'], activation=\'relu\', input_shape=(28 * 28,)),\n';
        value=value+'    layers.Dense(10, activation=\'softmax\')\n';
        value=value+'])\n';
        value=value+'   return model\n\n';

        value=value+'# 创建模型并编译\n';
        value=value+'model = build_model()\n';
        value=value+'model.compile(optimizer=keras.optimizers.SGD(learning_rate=params[\'learning_rate\']),\n';
        value=value+'              loss=\'sparse_categorical_crossentropy\',\n';
        value=value+'             metrics=[\'accuracy\'])\n\n';
    } else if (buildmodel=='Zebra'){
        value=value+'# ## 单元3.加载设计的模型\n';
        value=value+'def build_model(input_shape):\n';
        value=value+'    model = models.Sequential([\n';
        value=value+"        layers.Conv2D(16, (3, 3), activation='relu', input_shape=input_shape),\n";
        value=value+'        layers.MaxPooling2D(2, 2),\n';
        value=value+"        layers.Conv2D(32, (3, 3), activation='relu'),\n";
        value=value+'        layers.MaxPooling2D(2, 2),\n';
        value=value+'        layers.Flatten(),\n';
        value=value+"        layers.Dense(64, activation='relu'),\n";
        value=value+'        layers.Dense(5)  # 输出：分类(1) + 坐标(4)\n';
        value=value+'    ])\n';
        value=value+'    return model\n';
        value=value+'# ## 定义损失函数\n';
        value=value+'@tf.function  # 将该函数编译为 TensorFlow 图，提升性能，加快训练速度\n';
        value=value+'def custom_loss(y_true, y_pred):\n';
        value=value+'    # 提取类别标签（第 0 列）：y_true 和 y_pred 的第 0 列分别是类别的真实值和预测值\n';
        value=value+'    cls_true = y_true[:, 0]\n';
        value=value+'    cls_pred = y_pred[:, 0]\n';
        value=value+'            \n';
        value=value+'    # 计算分类损失：使用二分类交叉熵（binary_crossentropy）\n';
        value=value+'    # from_logits=True 表示预测值尚未经过 sigmoid 函数 \n';
        value=value+'    cls_loss = tf.keras.losses.binary_crossentropy(cls_true, cls_pred, from_logits=True)\n';
        value=value+'                                               \n';
        value=value+'    # 提取回归框（bbox）坐标（从第1列开始）：真实值和预测值的坐标部分\n';
        value=value+'    box_true = y_true[:, 1:]\n';
        value=value+'    box_pred = y_pred[:, 1:]\n';
        value=value+'                           \n';
        value=value+'    # 创建掩码：只有正样本（cls_true=1）的回归框才需要计算损失\n';
        value=value+'    # 将 cls_true 转为 float32 类型，0/1 对应无效/有效样本\n';
        value=value+'    mask = tf.cast(cls_true, tf.float32)\n';
        value=value+'                                     \n';
        value=value+'    # 使用均方误差（MSE）作为位置回归损失函数\n';
        value=value+'    mse = tf.keras.losses.MeanSquaredError()\n';
        value=value+'                                        \n';
        value=value+'    # 只对正样本的框进行回归损失计算（负样本的框乘以 0 被忽略）\n';
        value=value+'    # mask[:, None] 将 mask 扩展维度以匹配 box 坐标维度\n';
        value=value+'    reg_loss = mse(box_true * mask[:, None], box_pred * mask[:, None])\n';
        value=value+'                                                 \n';
        value=value+'    # 返回总损失：分类损失 + 回归损失（默认权重为 1:1，可按需要加权）\n';
        value=value+'    return cls_loss + reg_loss\n';
        value=value+'                             \n';
    }else if (buildmodel=='Cat_or_dog'){
        value=value+'\n';
        value=value+'\n';
        value=value+' # 加载模型\n';
        value=value+'model = tf.keras.models.load_model(MODEL_PATH)\n';
    }else if (buildmodel=='ASR'){
            value=value+'# 3. 加载模型（未实现）\n';
      value=value+'# 加载模型（当前无预训练模型加载逻辑）\n\n';
    }
    else if (buildmodel=='AlexNet5'){
        value=value+'# 模型结构\n';
        value=value+'def create_alexnet_model():\n';
        value=value+'    model = Sequential([\n';
        value=value+'        # 第一层卷积层：96个11x11卷积核，步幅为4，激活函数ReLU\n';
        value=value+"        Conv2D(96, kernel_size=(11, 11), strides=(4, 4), activation='relu', input_shape=(224, 224, 3)),\n";
        value=value+'        # 第一层最大池化层：3x3池化核，步幅为2\n';
        value=value+'        MaxPooling2D(pool_size=(3, 3), strides=(2, 2)),\n';
        value=value+"        # 第二层卷积层：256个5x5卷积核，padding设为'same'以保持尺寸\n";
        value=value+"        Conv2D(256, kernel_size=(5, 5), activation='relu', padding='same'),\n";
        value=value+'        # 第二层最大池化层\n';
        value=value+'        MaxPooling2D(pool_size=(3, 3), strides=(2, 2)),\n';
        value=value+'        # 第三、第四、第五层卷积层：分别为384、384、256个3x3卷积核\n';
        value=value+"        Conv2D(384, kernel_size=(3, 3), activation='relu', padding='same'),\n";
        value=value+"        Conv2D(384, kernel_size=(3, 3), activation='relu', padding='same'),\n";
        value=value+"        Conv2D(256, kernel_size=(3, 3), activation='relu', padding='same'),\n";
        value=value+'        # 第三层最大池化层\n';
        value=value+'        MaxPooling2D(pool_size=(3, 3), strides=(2, 2)),\n';
        value=value+'        # 扁平化操作，将多维特征映射为一维\n';
        value=value+'        Flatten(),\n';
        value=value+'        # 全连接层1：4096个神经元\n';
        value=value+"        Dense(4096, activation='relu'),\n";
        value=value+'        # Dropout：防止过拟合\n';
        value=value+'        Dropout(0.5),\n';
        value=value+'        # 全连接层2：4096个神经元\n';
        value=value+"        Dense(4096, activation='relu'),\n";
        value=value+'        Dropout(0.5),\n';
        value=value+'        # 输出层：1 个神经元（用于二分类），激活函数为 sigmoid\n';
        value=value+"        Dense(1, activation='sigmoid')  # 注意这里改为了 1\n";
        value=value+'    ])\n';
        value=value+'    # 编译模型：Adam优化器，使用 binary_crossentropy 作为损失函数\n';
        value=value+"    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])\n";
        value=value+'    return model\n';
        value=value+'         \n';
        value=value+'    \n';

}
else if (buildmodel == 'PCA') {

value = value + '# 提取特征和目标变量\n';
value = value + 'X = dataset.data# 前三列是运动变量（Chins、Situps和Jumps），在实际应用中，需要根据问题的具体需求来选择特征\n';
value = value + 'y = dataset.target# 后三列是生理测量变量，对于PCA，通常只关心特征矩阵X\n';
value = value + '# 注意：在实际应用中，你可能需要根据问题的具体需求来选择特征\n';
value = value + '\n';
value = value + '# 标准化特征（PCA对特征的尺度敏感）\n';
value = value + 'from sklearn.preprocessing import StandardScaler\n';
value = value + 'scaler = StandardScaler()\n';
value = value + 'X_scaled = scaler.fit_transform(X)\n';
value = value + '\n';
value = value + '# 应用PCA降维\n';
value = value + 'pca = PCA(n_components=2)  # 将数据降维到2维\n';
value = value + 'X_pca = pca.fit_transform(X_scaled)\n';

}
else if (buildmodel == 'SVM') {
value = value + "DATA_DIR = os.path.join(BASE_DIR, 'ChnSentiCorp/')\n";
value = value + "STOPWORDS_PATH = os.path.join(BASE_DIR, 'scu_stopwords.txt') \n";
value = value + '                 \n';
value = value + '# 确保目录存在               \n';
value = value + 'os.makedirs(DATA_DIR, exist_ok=True)   \n';
value = value + '                                         \n';
value = value + '                                                       \n';
value = value + '# ====================== 数据预处理函数 ======================   \n';
value = value + 'def clean_text(text):           \n';
value = value + '    """清理文本，只保留中文""" \n';
value = value + "    text = re.sub(r'[^\u4e00-\u9fa5]', '', text)\n";
value = value + '    return text.strip() \n';
value = value + '                 \n';
value = value + '                 \n';
value = value + 'def get_stopwords():  \n';
value = value + '    """加载停用词表"""  \n';
value = value + "    with open(STOPWORDS_PATH, 'r', encoding='utf8') as f: \n";
value = value + "        return set(f.read().strip().split('\\n'))  \n";
value = value + '                                     \n';
value = value + '                              \n';
value = value + 'def tokenize(text, stopwords): \n';
value = value + '    """分词并去除停用词""" \n';
value = value + '    words = [word for word in jieba.cut(text) if word not in stopwords] \n';
value = value + '    return words \n';
value = value + '         \n';
value = value + '              \n';
value = value + 'def load_and_process(file_path, stopwords): \n';
value = value + '    """加载并处理数据""" \n';
value = value + "    with open(file_path, 'rb') as f:\n";
value = value + '        contents = pickle.load(f)\n';
value = value + '    return [tokenize(clean_text(text), stopwords) for text in tqdm(contents)]\n';

}
    return value;
}
Blockly.Python['ai_trainmodel'] = function(block) {
    var trainmodel = block.getFieldValue('NAME');
    var value='\n';
    if (trainmodel=='custom'){
        value=value+'custom\n';
    }else if (trainmodel=='kmeans'){
        value=value+'# 训练模型\n';
        value=value+'kmeans.fit(X_scaled)\n';
        value=value+'# 获取聚类结果\n';
        value=value+'cluster_labels = kmeans.labels_\n';
    }else if (trainmodel=='LinearRegression'||trainmodel=='LogisticRegression'||trainmodel=='KNN'||trainmodel=='CART'){
        value=value+'# 训练模型\n';
        value=value+'model.fit(X_train, y_train)\n';
    }
    else if (trainmodel=='FCNN'){
        value=value+'# 训练模型\n';
        value=value+'history = model.fit(x_train, y_train,\n';
        value=value+"                    validation_data=(x_val, y_val),\n";
        value=value+'                    epochs=params[\'num_epochs\'],\n';
        value=value+'                    batch_size=params[\'batch_size\'])\n';
    }
    else if (trainmodel=='SVM'){
value = value + '# ====================== 主程序 ======================\n';
value = value + 'if __name__ == "__main__":\n';
value = value + '    print("=" * 50)\n';
value = value + '    print("开始情感分析流程...")\n';
value = value + '\n';
value = value + '    # 步骤1: 数据预处理\n';
value = value + '    print("\\n[步骤1] 加载停用词并处理数据...")\n';
value = value + '    try:\n';
value = value + '        stopwords = get_stopwords()\n';
value = value + '        print(f"加载停用词表，包含 {len(stopwords)} 个停用词")\n';
value = value + '\n';
value = value + '        # 处理负面和正面数据\n';
value = value + '        neg_data = load_and_process(os.path.join(DATA_DIR, "neg.pickle"), stopwords)\n';
value = value + '        pos_data = load_and_process(os.path.join(DATA_DIR, "pos.pickle"), stopwords)\n';
value = value + '        print(f"处理完成: 负面样本 {len(neg_data)} 条, 正面样本 {len(pos_data)} 条")\n';
value = value + '\n';
value = value + '    except Exception as e:\n';
value = value + '        print(f"数据处理错误: {e}")\n';
value = value + '        exit(1)\n';
value = value + '\n';
value = value + '    # 步骤2: 训练Word2Vec词向量模型\n';
value = value + '    print("\\n[步骤2] 训练Word2Vec模型...")\n';
value = value + '    try:\n';
value = value + '        corpus = neg_data + pos_data\n';
value = value + '        w2v_model = Word2Vec(\n';
value = value + '            sentences=corpus,\n';
value = value + '            vector_size=100,  # 减小向量维度以加速处理\n';
value = value + '            window=5,\n';
value = value + '            min_count=1,\n';
value = value + '            workers=4,\n';
value = value + '            epochs=5  # 减少训练轮数\n';
value = value + '        )\n';
value = value + '        print(f"词向量模型训练完成! 词汇表大小: {len(w2v_model.wv)}")\n';
value = value + '\n';
value = value + '    except Exception as e:\n';
value = value + '        print(f"训练词向量模型时出错: {e}")\n';
value = value + '        exit(1)\n';
value = value + '\n';
value = value + '    # 步骤3: 构建句子向量\n';
value = value + '    print("\\n[步骤3] 构建句子向量...")\n';
value = value + '    try:\n';
value = value + '        # 构建句子向量（词向量的平均值）\n';
value = value + '        def build_sentence_vec(words):\n';
value = value + '            vecs = [w2v_model.wv[word] for word in words if word in w2v_model.wv]\n';
value = value + '            return np.mean(vecs, axis=0) if vecs else np.zeros(w2v_model.vector_size)\n';
value = value + '\n';
value = value + '        neg_vecs = [build_sentence_vec(words) for words in tqdm(neg_data)]\n';
value = value + '        pos_vecs = [build_sentence_vec(words) for words in tqdm(pos_data)]\n';
value = value + '\n';
value = value + '        # 创建数据集\n';
value = value + '        X = np.array(neg_vecs + pos_vecs)\n';
value = value + '        y = np.array([0] * len(neg_vecs) + [1] * len(pos_vecs))\n';
value = value + '\n';
value = value + '        print(f"向量化数据完成: 总样本数 {len(X)}")\n';
value = value + '\n';
value = value + '    except Exception as e:\n';
value = value + '        print(f"构建句子向量时出错: {e}")\n';
value = value + '        exit(1)\n';
value = value + '\n';
value = value + '    # 步骤4: 降维与分类\n';
value = value + '    print("\\n[步骤4] 降维与分类...")\n';
value = value + '    try:\n';
value = value + '        # 使用PCA降维到50维（进一步简化）\n';
value = value + '        pca = PCA(n_components=50)\n';
value = value + '        X_pca = pca.fit_transform(X)\n';
value = value + '        print(f"降维完成: {X.shape[1]}维 -> {X_pca.shape[1]}维")\n';
value = value + '\n';
value = value + '        # 划分训练集和测试集\n';
value = value + '        X_train, X_test, y_train, y_test = train_test_split(\n';
value = value + '            X_pca, y, test_size=0.2, random_state=42\n';
value = value + '        )\n';
value = value + '\n';
value = value + '        # 使用线性SVM（更快且效果通常不错）\n';
value = value + '        print("\\n训练SVM分类器...")\n';
value = value + '        svc = svm.SVC(kernel=\'linear\', C=1.0)\n';
value = value + '        svc.fit(X_train, y_train)\n';
value = value + '\n';
value = value + '        # 评估模型\n';
value = value + '        y_pred = svc.predict(X_test)\n';
value = value + '        accuracy = metrics.accuracy_score(y_test, y_pred)\n';
value = value + '        report = metrics.classification_report(y_test, y_pred)\n';
value = value + '\n';
value = value + '        print("\\n" + "=" * 50)\n';
value = value + '        print(f"测试集准确率: {accuracy:.4f}")\n';
value = value + '        print("分类报告:")\n';
value = value + '        print(report)\n';
value = value + '        print("=" * 50)\n';
value = value + '\n';

      }
    else if (trainmodel=='AlexNet5'){
        value=value+'# 创建模型\n';
        value=value+'model = create_alexnet_model()\n';
        value=value+'# 训练模型\n';
        value=value+'history = model.fit(\n';
        value=value+'    train_images, train_labels,  # 输入训练集的图片和标签\n';
        value=value+'    validation_data=(test_images, test_labels),  # 输入验证集的图片和标签\n';
        value=value+'    epochs=2,  # 训练轮次设置为2轮\n';
        value=value+'    batch_size=32  # 每次训练的小批量大小设置为32\n';
        value=value+')\n';
    }else if (trainmodel=='Zebra') {

        value=value+'# ## 单元4.训练验证保存模型\n';
        value=value+'def train_and_evaluate():\n';
        value=value+'    # 加载数据\n';
        value=value+'    dataset = ZebraDataset(DATA_PATH)\n';
        value=value+'    X, y = dataset.load_data()\n';
        value=value+'                               \n';
        value=value+'    # 划分数据集：60%训练，20%验证，20%测试\n';
        value=value+'    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.4, random_state=42)\n';
        value=value+'    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)\n';
        value=value+'                                                  \n';
        value=value+'    # 构建模型\n';
        value=value+'    model = build_model((IMG_SIZE, IMG_SIZE, 3))\n';
        value=value+'    model.compile(\n';
        value=value+'        optimizer=optimizers.Adam(learning_rate=0.001),\n';
        value=value+'        loss=custom_loss,\n';
        value=value+"        metrics=['accuracy']\n";
        value=value+'    )\n';
        value=value+'     \n';
        value=value+'    # 训练模型\n';
        value=value+'    history = model.fit(\n';
        value=value+'        X_train, y_train,\n';
        value=value+'        validation_data=(X_val, y_val),\n';
        value=value+'        epochs=EPOCHS,\n';
        value=value+'        batch_size=BATCH_SIZE\n';
        value=value+'    )\n';
        value=value+'          \n';
        value=value+'    # 评估模型\n';
        value=value+'    test_loss, test_acc = model.evaluate(X_test, y_test)\n';
        value=value+'    print(f"测试集评估结果：损失={test_loss:.4f}, 准确率={test_acc:.4f}")\n';
        value=value+'                           \n';
        value=value+'    # 保存模型 \n';
        value=value+"    model.save('zebra_cnn_model.h5')\n";
        value=value+'    return model\n';
    }else if (trainmodel=='ASR'){
      value=value+'# 4. 训练模型\n';
value=value+'def train_model_gmm(train_dir):\n';
value=value+'    gmm_models = []\n';
value=value+'    for digit in os.listdir(train_dir):\n';
value=value+'        digit_dir = os.path.join(train_dir, digit)\n';
value=value+'        label = digit_dir[digit_dir.rfind("/") + 1:]\n';
value=value+'        X = np.array([])\n';
value=value+'        train_files = [x for x in os.listdir(digit_dir) if x.endswith(".wav")]\n';
value=value+'        for file_name in train_files:\n';
value=value+'            file_path = os.path.join(digit_dir, file_name)\n';
value=value+'            with warnings.catch_warnings():\n';
value=value+'                warnings.simplefilter("ignore")\n';
value=value+'                features_mfcc = mfcc(file_path)\n';
value=value+'            if len(X) == 0:\n';
value=value+'                X = features_mfcc\n';
value=value+'            else:\n';
value=value+'                X = np.append(X, features_mfcc, axis=0)\n';
value=value+'        model = GaussianMixture(n_components=2, covariance_type="diag")\n';
value=value+'        np.seterr(all="ignore")\n';
value=value+'        model.fit(X)\n';
value=value+'        gmm_models.append((model, label))\n';
value=value+'    return gmm_models\n\n';
    }
    else if (trainmodel=='CNN'){
value=value+'    # 训练模型\n';
value=value+'history = model.fit(train_generator,epochs=EPOCHS,validation_data=val_generator)    \n';
    }
    return value;
}

Blockly.Python['ai_predictmodel'] = function(block) {
    var predictmodel = block.getFieldValue('NAME');
    var value='';
    if (predictmodel=='custom'){
        value=value+'custom\n';
    }else if (predictmodel=='kmeans'){
        value=value+'# 获取聚类结果    \n';
        value=value+"cluster_labels = kmeans.labels_\n";
        value=value+'plt.figure(figsize=(8, 6))\n';
        value=value+'plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=cluster_labels, cmap=\'viridis\', marker=\'o\', edgecolor=\'k\', s=50)\n';

        value=value+'# 标记聚类中心\n';
        value=value+'centers = kmeans.cluster_centers_\n';
        value=value+'plt.scatter(centers[:, 0], centers[:, 1], c=\'red\', s=200, alpha=0.75, marker=\'X\', label=\'Centroids\')\n';

        value=value+'plt.xlabel(\'Feature 1\')\n';
        value=value+'plt.ylabel(\'Feature 2\')\n';
        value=value+'plt.title(\'K-Means Clustering on Dataset\')\n';
        value=value+'plt.legend()\n';
        value=value+'plt.grid(True)\n';
        value=value+'plt.savefig(\'output.png\')\n';
    }
   else if (predictmodel=='PCA'){
        value=value+'   # 可视化降维后的数据\n';
        value=value+'plt.scatter(X_pca[:, 0], X_pca[:, 1])\n';
        value=value+"plt.xlabel('Principal Component 1')\n";
        value=value+"plt.ylabel('Principal Component 2')\n";
        value=value+"plt.title('PCA of Linnerud Dataset (2D projection)')\n";
        value=value+"plt.savefig('output.png')\n";
        value=value+'\n';
        value=value+'# 输出PCA结果\n';
        value=value+'print("主成分方差解释率:", pca.explained_variance_ratio_)\n';
        value=value+'print("主成分:", pca.components_)\n';

   }
    else if (predictmodel=='LinearRegression'){
        value=value+'# 进行预测\n';
        value=value+'y_pred = model.predict(X_test)   \n';
        value=value+'              \n';
        value=value+'# 评估模型     \n';
        value=value+'mse = mean_squared_error(y_test, y_pred)\n';
        value=value+'r2 = r2_score(y_test, y_pred)\n';
        value=value+"print(f'Mean Squared Error: {mse:.2f}')\n";
        value=value+"print(f'R^2 Score: {r2:.2f}')\n";
        value=value+'# 可视化拟合结果 \n';
        value=value+"plt.scatter(X_test, y_test, color='blue', label='Actual')\n";
        value=value+"plt.plot(X_test, y_pred, color='red', linewidth=3, label='Predicted')\n";
        value=value+'plt.xlabel(feature_name)\n';
        value=value+"plt.ylabel('MEDV (' + target_column + ')')\n";
        value=value+"plt.title(f'Linear Regression Fit for {feature_name}')\n";
        value=value+'plt.legend() \n';
        value=value+"plt.savefig('output.png')  \n";

    } else if (predictmodel=='Zebra'){
        value=value+'# ## 单元5.预测\n';
        value=value+'           \n';
        value=value+'def predict_and_visualize(model, img_path):\n';
        value=value+'    # 加载原始图像 \n';
        value=value+'    orig_img = cv2.imread(img_path)\n';
        value=value+'    if orig_img is None:\n';
        value=value+'        print(f"错误：无法读取图片 {img_path}")\n';
        value=value+'        return\n';
        value=value+'             \n';
        value=value+'    h, w = orig_img.shape[:2]\n';
        value=value+'                       \n';
        value=value+'    # 预处理\n';
        value=value+'    img = cv2.cvtColor(orig_img, cv2.COLOR_BGR2RGB)\n';
        value=value+'    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE)) / 255.0\n';
        value=value+'    img = np.expand_dims(img, axis=0)\n';
        value=value+'          \n';
        value=value+'    # 预测\n';
        value=value+'    pred = model.predict(img)[0]\n';
        value=value+'    cls_prob = 1 / (1 + np.exp(-pred[0]))  # Sigmoid转换概率\n';
        value=value+'                              \n';
        value=value+'    if cls_prob > 0.5:\n';
        value=value+'        # 还原坐标到原始尺寸\n';
        value=value+'        xmin = int(pred[1] * w)\n';
        value=value+'        ymin = int(pred[2] * h)\n';
        value=value+'        xmax = int(pred[3] * w)\n';
        value=value+'        ymax = int(pred[4] * h)\n';
        value=value+'                \n';
        value=value+'        # 打印坐标\n';
        value=value+'        print(f"检测到斑马线，坐标框：")\n';
        value=value+'        print(f"左上角: ({xmin}, {ymin})")\n';
        value=value+'        print(f"右下角: ({xmax}, {ymax})")\n';
        value=value+'                         \n';
        value=value+'        # 绘制结果\n';
        value=value+'        cv2.rectangle(orig_img, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)\n';
        value=value+'        cv2.putText(orig_img, f"Zebra: {cls_prob:.2f}", (xmin, ymin - 10),\n';
        value=value+'                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)\n';
        value=value+'    else:\n';
        value=value+'        print("未检测到斑马线")\n';
        value=value+'        cv2.putText(orig_img, "No Zebra Crossing", (10, 30),\n';
        value=value+'                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)\n';
        value=value+'                  \n';
        value=value+'    # # 显示结果\n';
        value=value+'    #cv2.imshow("Detection Result", orig_img)\n';
        value=value+'    #cv2.waitKey(0)\n';
        value=value+'    #cv2.destroyAllWindows()\n';
        value=value+'    # 使用 matplotlib 显示图像（代替cv2.imshow)\n';
        value=value+'    plt.figure(figsize=(6, 6))\n';
        value=value+'    plt.imshow(cv2.cvtColor(orig_img, cv2.COLOR_BGR2RGB))  # 转回RGB\n';
        value=value+'    plt.title("Detection Result")\n';
        value=value+'    plt.axis("off")  # 不显示坐标轴\n';
        value=value+'    plt.savefig(\'output.png\')\n';
        value=value+'                  \n';
        value=value+'                         \n';
        value=value+'if __name__ == "__main__":\n';
        value=value+'    # 训练并评估模型\n';
        value=value+'    trained_model = train_and_evaluate()\n';
        value=value+'                  \n';
        value=value+'    # 测试指定图片\n';
        value=value+'    if os.path.exists(TEST_IMG_PATH):\n';
        value=value+'        print("正在测试图片:", TEST_IMG_PATH)\n';
        value=value+'        predict_and_visualize(trained_model, TEST_IMG_PATH)\n';
        value=value+'    else:\n';
        value=value+'        print(f"测试图片不存在：{TEST_IMG_PATH}")\n';
    }else if (predictmodel=='Cat_or_dog'){
        value=value+'\n';
        value=value+'\n';
        value=value+'\n';
        value=value+'# 加载图像并预测\n';
        value=value+'img_batch, img_display = load_and_preprocess_image(IMAGE_PATH)\n';
        value=value+'prediction = model.predict(img_batch)[0][0]\n';
        value=value+'label = "Dog" if prediction > 0.5 else "Cat"\n';
        value=value+'confidence = round(prediction if prediction > 0.5 else 1 - prediction, 2)\n';

        value=value+'# 在图像上添加文字，并显示\n';
        value=value+'output_img = img_display.copy()\n';
        value=value+'cv2.putText(output_img, f"{label} ({confidence * 100:.1f}%)", (10, 20),\n';
        value=value+'            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0) if label == "Dog" else (255, 0, 0), 2)\n';

        value=value+'# 显示图像\n';
        value=value+'plt.imshow(output_img)\n';
        value=value+"plt.axis('off')\n";
        value=value+'plt.title("Prediction Result")\n';
        value=value+'plt.savefig(\'output2.png\')\n';
    }else if (predictmodel=='ASR'){
      value=value+'# 6. 预测并评估模型\n';
value=value+'def predict_gmm(gmm_models, test_files):\n';
value=value+'    count = 0\n';
value=value+'    pred_true = 0\n';
value=value+'    for test_file in test_files:\n';
value=value+'        with warnings.catch_warnings():\n';
value=value+'            warnings.simplefilter("ignore")\n';
value=value+'            features_mfcc = mfcc(test_file)\n';
value=value+'        max_score = -float("inf")\n';
value=value+'        predicted_label = ""\n';
value=value+'        for item in gmm_models:\n';
value=value+'            model, label = item\n';
value=value+'            score = model.score(features_mfcc)\n';
value=value+'            if score > max_score:\n';
value=value+'                max_score = score\n';
value=value+'                predicted_label = label\n';
value=value+'        true_label = os.path.splitext(test_file)[0][-1]\n';
value=value+'        pred_digit = predicted_label[-1]\n';
value=value+'        filename = os.path.basename(test_file)\n';
value=value+'        print(f"文件: {filename}, 真实结果: {true_label}, 预测结果: {pred_digit}")\n';
value=value+'        count += 1\n';
value=value+'        if true_label == pred_digit:\n';
value=value+'            pred_true += 1\n';
value=value+'    print("---------- GMM (GaussianMixture) ----------")\n';
value=value+'    print("Train num: 160, Test num: %d, Predict true num: %d"%(count, pred_true))\n';
value=value+'    print("Accuracy: %.2f"%(pred_true / count))\n\n';

value=value+'if __name__ == "__main__":\n';
value=value+'    gmm_models = train_model_gmm("./processed_train_records")\n';
value=value+'    test_files = []\n';
value=value+'    for root, dirs, files in os.walk("./processed_test_records"):\n';
value=value+'        for file in files:\n';
value=value+'            if file.endswith(".wav"):\n';
value=value+'                test_files.append(os.path.join(root, file))\n';
value=value+'    predict_gmm(gmm_models, test_files)\n';

    }
    else if (predictmodel=='LogisticRegression'||predictmodel=='KNN'||predictmodel=='CART'){

        value=value+'# 对测试集进行预测\n';
        value=value+'y_pred = model.predict(X_test)\n\n';

        value=value+'# 评估模型\n';
        value=value+'accuracy = accuracy_score(y_test, y_pred,target_names)\n';
        value=value+'report = classification_report(y_test, y_pred)\n';

        value=value+'print(f"分类精度: {accuracy}")\n';
        value=value+'print("分类报告:")\n';
        value=value+'print(report)\n\n';

        value=value+'# 可视化预测结果\n';
        value=value+'plt.scatter(y_test, y_pred)\n';
        value=value+'plt.xlabel("True Values")\n';
        value=value+'plt.ylabel("Predictions")\n';
        value=value+'plt.title("Predictions vs True Values")\n';
        value=value+'plt.savefig(\'output.png\')\n';
    }
    else if (predictmodel=='FCNN'||predictmodel=='AlexNet5'){
        value=value+'# 可视化训练过程中的准确率变化 验证与测试\n';
        value=value+'import matplotlib.pyplot as plt\n';
        value=value+"plt.plot(history.history['accuracy'], label='Training Accuracy')  # 绘制训练集准确率曲线\n";
        value=value+"plt.plot(history.history['val_accuracy'], label='Test Accuracy')  # 绘制验证集准确率曲线\n";
        value=value+'plt.legend()  # 显示图例\n';
        value=value+"plt.xlabel('Epochs')  # 横坐标名称：训练轮次\n";
        value=value+"plt.ylabel('Accuracy')  # 纵坐标名称：准确率\n";
        value=value+"plt.title('Training and Test Accuracy')  # 图表标题\n";
        value=value+"plt.savefig('output1.png')\n";
        value=value+"plt.savefig('output.png')\n";

    }
    else if (predictmodel=='SVM'){
value = value + '        # 保存模型\n';
value = value + '        model_path = os.path.join(DATA_DIR, \'sentiment_model.pkl\')\n';
value = value + '        with open(model_path, \'wb\') as f:\n';
value = value + '            pickle.dump(svc, f)\n';
value = value + '        print(f"模型已保存至: {model_path}")\n';
value = value + '\n';
value = value + '    except Exception as e:\n';
value = value + '        print(f"分类过程中出错: {e}")\n';
value = value + '        exit(1)\n';
value = value + '\n';
value = value + '    print("\\n情感分析流程完成!")\n';
value = value + '\n';
    }
    else if (predictmodel=='CNN'){
        value=value+'    # 预测函数\n';
        value=value+'def predict_image(img_path):\n';
        value=value+'    img = cv2.imread(img_path)\n';
        value=value+'    if img is None:\n';
        value=value+'        return "无法读取图片", 0.0\n';
        value=value+'\n';
        value=value+'    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))\n';
        value=value+'    img = img / 255.0\n';
        value=value+'    img = np.expand_dims(img, axis=0)\n';
        value=value+'\n';
        value=value+'    prediction = model.predict(img)[0][0]\n';
        value=value+'    return "斑马线" if prediction > 0.5 else "非斑马线", prediction\n';

    }

    return value;
}
Blockly.Python['ai_predictfile'] = function(block){
    var predictmodel = block.getFieldValue('NAME');
    var predictfile=block.getFieldValue('filepath');
    var value='';
    if (predictmodel=='custom'){
        value=value+'custom\n';
    }else if (predictmodel=='CNN'){

        value=value+'test_image = \"'+predictfile+'\"  # 修改为实际路径\n';
        value=value+'result, confidence = predict_image(test_image)\n';
        value=value+'print(f\"\\n预测结果: {result}\")\n';
        value=value+'print(f\"置信度: {confidence:.2%}\")\n';

    }
         else if (predictmodel=='SVM'){
        value=value+'      #预测与评估\n';
        value=value+'from sklearn.metrics import accuracy_score, classification_report\n';
        value=value+'\n';
        value=value+'# 预测测试集\n';
        value=value+'y_pred = svm.predict(X_test)\n';
        value=value+'# 计算准确率\n';
        value=value+'print(f"测试集准确率: {accuracy_score(y_test, y_pred):.4f}")\n';
        value=value+'\n';
        value=value+'# 打印分类报告\n';
        value=value+'print(classification_report(y_test, y_pred))\n';
        value=value+'# 加载模型\n';
        value=value+"loaded_model = joblib.load('D:/Blockly-AI-Program/sourcecode/model/svm_s_model.pkl')\n";
        value=value+'# 新样本预测\n';
        value=value+'new_review = "这家酒店环境很好，服务也很周到，下次还会选择这里。"\n';
        value=value+'new_tokens = chinese_tokenizer(new_review)\n';
        value=value+'new_sequence = tokenizer.texts_to_sequences([new_tokens])\n';
        value=value+'new_X = pad_sequences(new_sequence, maxlen=max_length)\n';
        value=value+'prediction = loaded_model.predict(new_X)\n';
        value=value+'\n';
        value=value+"print(f\"情感预测结果: {'正面' if prediction[0] == 1 else '负面'}\")\n";
     }

    return value;
}
Blockly.Python['ai_savemodel'] = function(block) {
    var modelpath=block.getFieldValue('modelpath');

    var value='';

    modelpath=modelpath.replace(/\\/g, '/');

    // value=value+'    # 保存模型到文件，便于后续加载和使用\n';
    // value=value+"model.save('cat_dog_classification_alexnet_binary.h5')\n";
    // value=value+'print("模型已保存为 cat_dog_classification_alexnet_binary.h5")\n';
return value;
}
Blockly.Python['ai_loadmodel'] = function(block) {
    var sframework=block.getFieldValue('NAME');
    var modelpath=block.getFieldValue('modelpath');
    var value='';

    modelpath=modelpath.replace(/\\/g, '/');
    if (sframework=='Pytorch'){
        value=value+'from tensorflow.torch.models import load_model\n';
    }
    if (sframework=='keras'){
        value=value+'from tensorflow.keras.models import load_model\n';
        //value=value+'model = load_model(r\'D:\fcnn_models\fcnn_model.keras\')\n';
    }
    value=value+'model =load_model(\''+modelpath+'\')\n';

    return value;
}
Blockly.Python['ai_loadFile'] = function(block) {
    var sframework=block.getFieldValue('TOOL');
    var filetype=block.getFieldValue('TYPE');
    var filepath=block.getFieldValue('filepath');
    var value='';

    filepath=filepath.replace(/\\/g, '/');
    if (sframework=='Pandas'){
        value=value+'import pandas as pd\n';
        if (filetype=='CSV'){
            value=value+'df = pd.read_csv(\''+filepath+'\')\n';
        }
        else if(filetype=='EXCEL'){
            value=value+'BASE_DIR =(\''+filepath+'\')\n';
        }
    }
    else if (sframework=='OpenCV'){
        value=value+'import cv2\n';
        value=value+'img = cv2.imread(\''+filepath+'\')\n';

    }
    else if (sframework=='Openpyxl'){
        value=value+'from openpyxl import load_workbook\n';
        value=value+'df = load_workbook(\''+filepath+'\')#*.xlsx\n';

    }
    else if (sframework=='Sqlite3'){
        value=value+'import sqlite3\n';

        value=value+'conn = sqlite3.connect(\''+filepath+'\')#*.db\n';
        value=value+'cursor = conn.cursor()\n';
        value=value+'cursor.execute(\'SELECT * FROM table_name\')\n';
        value=value+'rows = cursor.fetchall()\n';
        value=value+'for row in rows:\n';
        value=value+'    print(row)\n';
    }
    else if (sframework=='PyPDF2'){
        value=value+'import PyPDF2\n';
        value=value+'with open(\''+filepath+'\', \'rb\') as file:#*.pdf\n';
        value=value+'  reader = PyPDF2.PdfReader(file)\n';
        value=value+'  for page in reader.pages:\n';
        value=value+'    print(page.extract_text())\n';
    }
    else if (sframework=='Librosa'){

        value=value+'import librosa\n';
        value=value+'import librosa.display\n';
        value=value+'y,sr=librosa.load(\''+filepath+'\', sr=22050)#*.wav\n';

    }
    else if (sframework=='Python-docx'){
        value=value+'from docx import Document\n';
        value=value+'doc = Document(\''+filepath+'\')#*.docx\n';
        value=value+'for para in doc.paragraphs:\n';
        value=value+'    print(para.text)\n';
    }
    else if (sframework=='CSV工具'){
        value=value+'import csv\n';

        value=value+'with open(\''+filepath+'\', \'r\', newline=\'\', encoding=\'utf-8\') as csvfile:#*.csv\n';
        value=value+'   reader = csv.reader(csvfile)\n';
        value=value+'for row in reader:\n';
        value=value+'    print(row)\n';
    }
    else if  (sframework=='内置工具'){
        value=value+'with open(\''+filepath+'\', \'r\', encoding=\'utf-8\') as file:\n';
        value=value+'\tcontent = file.read()\n\n';
    }
    return value;
}
Blockly.Python['ai_saveFile'] = function(block) {
    var sframework=block.getFieldValue('NAME');
    var filepath=block.getFieldValue('filepath');
    var value='';

    filepath=filepath.replace(/\\/g, '/');
    if (sframework=='Pandas'){
        //value=value+'import pandas as pd\n';
        value=value+'df.to_csv(\''+filepath+'\')\n';
    }
    else if (sframework=='OpenCV'){
        //value=value+'import cv2\n';
        value=value+'cv2.imwrite(\''+filepath+'\', comparison)\n';
    }
    else if (sframework=='Openpyxl'){
        value=value+'from openpyxl import load_workbook\n';
        value=value+'df.to_excel(\''+filepath+'\', index=False) #*.xlsx\n';
    }
    else if (sframework=='Sqlite3'){
        //value=value+'import sqlite3\n';

        value=value+'conn = sqlite3.connect(\''+filepath+'\')#*.db\n';
        value=value+'cursor = conn.cursor()\n';
        value=value+'cursor.execute(\'CREATE TABLE IF NOT EXISTS users (name TEXT, age INT)\')\n';
        value=value+'cursor.execute("INSERT INTO users VALUES (?, ?)", ("Alice", 30))\n';
        value=value+'conn.commit()\n';
        value=value+'conn.close()\n';
    }
    else if (sframework=='PyPDF2'){
        //value=value+'import PyPDF2\n';
        value=value+'with open(\''+filepath+'\', \'wb\') as file:#*.pdf\n';
        value=value+'  pdf_writer.write(file)\n';

    }
    else if (sframework=='Python-docx'){
        //value=value+'from docx import Document\n';
        value=value+'doc = Document(\''+filepath+'\')#*.docx\n';
        value=value+'doc.add_paragraph(\'This is an additional paragraph.\')\n';
        value=value+'doc.save(\''+filepath+'\')\n';

    }
    else if (sframework=='CSV工具'){
        //value=value+'import csv\n';
        value=value+'rows = [["Name", "Age"], ["Alice", 30], ["Bob", 25]]\n';
        value=value+'with open(\''+filepath+'\', \'w\', newline=\'\', encoding=\'utf-8\') as csvfile:#*.csv\n';
        value=value+'   writer = csv.writer(csvfile)\n';
        value=value+'writer.writerows(rows)\n';
    }
    else if  (sframework=='内置工具'){
        value=value+'with open(\''+filepath+'\', \'w\', encoding=\'utf-8\') as file:\n';
        value=value+'   file.write("Hello World\n这是文本内容")\n';
    }
    return value;
}
Blockly.JavaScript['js_function_expression'] = function(block) {
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    var name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var args = [];
    for (var i = 0; i < block.paramCount; i++) {
        args[i] = Blockly.JavaScript.valueToCode(block, 'PARAM' + i, Blockly.JavaScript.ORDER_ATOMIC);
    }
    var code = 'yak.' + name + '=' + 'function ' +  '(' + args.join(', ') + ') {\n' + branch + '}';
    if (block.outputConnection) {
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
    } else {
        return code + ';\n';
    }
};

Blockly.Blocks['field_checkbox'] = {
  // Checkbox.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('checkbox')
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'CHECKED')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Checkbox field.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=485');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_colour'] = {
  // Colour input.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('colour')
        .appendField(new Blockly.FieldColour('#ff0000'), 'COLOUR')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Colour input field.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=495');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_variable'] = {
  // Dropdown for variables.
  init: function() {
    this.setColour(160);
    this.appendDummyInput()
        .appendField('variable')
        .appendField(new Blockly.FieldTextInput('item'), 'TEXT')
        .appendField(',')
        .appendField(new Blockly.FieldTextInput('NAME'), 'FIELDNAME');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Dropdown menu for variable names.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=510');
  },
  onchange: function() {
    fieldNameCheck(this);
  }
};

Blockly.Blocks['field_image'] = {
  // Image.
  init: function() {
    this.setColour(160);
    var src = 'https://www.gstatic.com/codesite/ph/images/star_on.gif';
    this.appendDummyInput()
        .appendField('image')
        .appendField(new Blockly.FieldTextInput(src), 'SRC');
    this.appendDummyInput()
        .appendField('width')
        .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'WIDTH')
        .appendField('height')
        .appendField(new Blockly.FieldNumber('15', 0, NaN, 1), 'HEIGHT')
        .appendField('alt text')
        .appendField(new Blockly.FieldTextInput('*'), 'ALT')
        .appendField('flip RTL')
        .appendField(new Blockly.FieldCheckbox('false'), 'FLIP_RTL');
    this.setPreviousStatement(true, 'Field');
    this.setNextStatement(true, 'Field');
    this.setTooltip('Static image (JPEG, PNG, GIF, SVG, BMP).\n' +
                    'Retains aspect ratio regardless of height and width.\n' +
                    'Alt text is for when collapsed.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=567');
  }
};

Blockly.Blocks['type_group'] = {
  // Group of types.
  init: function() {
    this.typeCount_ = 2;
    this.updateShape_();
    this.setOutput(true, 'Type');
    this.setMutator(new Blockly.icons.MutatorIcon(['type_group_item'], this));
    this.setColour(230);
    this.setTooltip('Allows more than one type to be accepted.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677');
  },
  mutationToDom: function(workspace) {
    // Create XML to represent a group of types.
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('types', this.typeCount_);
    return container;
  },
  domToMutation: function(container) {
    // Parse XML to restore the group of types.
    this.typeCount_ = parseInt(container.getAttribute('types'), 10);
    this.updateShape_();
    for (var i = 0; i < this.typeCount_; i++) {
      this.removeInput('TYPE' + i);
    }
    for (var i = 0; i < this.typeCount_; i++) {
      var input = this.appendValueInput('TYPE' + i)
                      .setCheck('Type');
      if (i === 0) {
        input.appendField('any of');
      }
    }
  },
  decompose: function(workspace) {
    // Populate the mutator's dialog with this block's components.
    var containerBlock = workspace.newBlock('type_group_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.typeCount_; i++) {
      var typeBlock = workspace.newBlock('type_group_item');
      typeBlock.initSvg();
      connection.connect(typeBlock.previousConnection);
      connection = typeBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Reconfigure this block based on the mutator dialog's components.
    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (typeBlock) {
      connections.push(typeBlock.valueConnection_);
      typeBlock = typeBlock.nextConnection &&
          typeBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.typeCount_; i++) {
      var connection = this.getInput('TYPE' + i).connection.targetConnection;
      if (connection && !connections.includes(connection)) {
        connection.disconnect();
      }
    }
    this.typeCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.typeCount_; i++) {
      connections[i]?.reconnect(this, 'TYPE' + i);
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var typeBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (typeBlock) {
      var input = this.getInput('TYPE' + i);
      typeBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      typeBlock = typeBlock.nextConnection &&
          typeBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    // Modify this block to have the correct number of inputs.
    // Add new inputs.
    for (var i = 0; i < this.typeCount_; i++) {
      if (!this.getInput('TYPE' + i)) {
        var input = this.appendValueInput('TYPE' + i);
        if (i === 0) {
          input.appendField('any of');
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('TYPE' + i)) {
      this.removeInput('TYPE' + i);
      i++;
    }
  }
};

Blockly.Blocks['type_group_container'] = {
  // Container.
  init: function() {
    this.jsonInit({
      "message0": "add types %1 %2",
      "args0": [
        {"type": "input_dummy"},
        {"type": "input_statement", "name": "STACK"}
      ],
      "colour": 230,
      "tooltip": "Add, or remove allowed type.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677"
    });
  }
};

Blockly.Blocks['type_group_item'] = {
  // Add type.
  init: function() {
    this.jsonInit({
      "message0": "type",
      "previousStatement": null,
      "nextStatement": null,
      "colour": 230,
      "tooltip": "Add a new allowed type.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=677"
    });
  }
};

Blockly.Blocks['type_null'] = {
  // Null type.
  valueType: null,
  init: function() {
    this.jsonInit({
      "message0": "any",
      "output": "Type",
      "colour": 230,
      "tooltip": "Any type is allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_boolean'] = {
  // Boolean type.
  valueType: 'Boolean',
  init: function() {
    this.jsonInit({
      "message0": "Boolean",
      "output": "Type",
      "colour": 230,
      "tooltip": "Booleans (true/false) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_number'] = {
  // Number type.
  valueType: 'Number',
  init: function() {
    this.jsonInit({
      "message0": "Number",
      "output": "Type",
      "colour": 230,
      "tooltip": "Numbers (int/float) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_string'] = {
  // String type.
  valueType: 'String',
  init: function() {
    this.jsonInit({
      "message0": "String",
      "output": "Type",
      "colour": 230,
      "tooltip": "Strings (text) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_list'] = {
  // List type.
  valueType: 'Array',
  init: function() {
    this.jsonInit({
      "message0": "Array",
      "output": "Type",
      "colour": 230,
      "tooltip": "Arrays (lists) are allowed.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=602"
    });
  }
};

Blockly.Blocks['type_other'] = {
  // Other type.
  init: function() {
    this.jsonInit({
      "message0": "other %1",
      "args0": [{"type": "field_input", "name": "TYPE", "text": ""}],
      "output": "Type",
      "colour": 230,
      "tooltip": "Custom type to allow.",
      "helpUrl": "https://www.youtube.com/watch?v=s2_xaEvcVI0#t=702"
    });
  }
};

Blockly.Blocks['colour_hue'] = {
  // Set the colour of the block.
  init: function() {
    this.appendDummyInput()
        .appendField('hue:')
        .appendField(new Blockly.FieldAngle('0', this.validator), 'HUE');
    this.setOutput(true, 'Colour');
    this.setTooltip('Paint the block with this colour.');
    this.setHelpUrl('https://www.youtube.com/watch?v=s2_xaEvcVI0#t=55');
  },
  validator: function(text) {
    // Update the current block's colour to match.
    var hue = parseInt(text, 10);
    if (!isNaN(hue)) {
      this.getSourceBlock().setColour(hue);
    }
  },
  mutationToDom: function(workspace) {
    var container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('colour', this.getColour());
    return container;
  },
  domToMutation: function(container) {
    this.setColour(container.getAttribute('colour'));
  }
};
Blockly.JavaScript['doStatement'] = function(block) {
    var text_text = block.getFieldValue('TEXT');
    var code = text_text + ';\n'; // 生成顺序结构的语句
    //var code = 'console.log("Hello, World!");\n'; // 直接添加控制台输出代码
    return code;
};

Blockly.Python['doStatement'] = function(block) {
    var text_text = block.getFieldValue('TEXT');
    var code = text_text + '\n'; // 生成顺序结构的语句
    return code;
};
Blockly.Blocks['doReady'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("数据集准备语句")
            .appendField(new Blockly.FieldTextInput("abc"), "TEXT");
        this.setTooltip('请输入要执行的数据集准备语句，这些语句将顺序执行.');
        this.setColour(80);
        this.setHelpUrl('');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

Blockly.JavaScript['textcomment'] = function(block) {
    var text_text = block.getFieldValue('TEXT');
    var code = '//' + text_text + ''; // 示例代码生成逻辑
    return code;
};
Blockly.Python['textcomment'] = function(block) {
    var text_text = block.getFieldValue('TEXT');
    var code = '#' + text_text + ''; // 示例代码生成逻辑
    return code;
};

/**
 * Check to see if more than one field has this name.
 * Highly inefficient (On^2), but n is small.
 * @param {!Blockly.Block} referenceBlock Block to check.
 */
function fieldNameCheck(referenceBlock) {
  if (!referenceBlock.workspace) {
    // Block has been deleted.
    return;
  }
  var name = referenceBlock.getFieldValue('FIELDNAME').toLowerCase();
  var count = 0;
  var blocks = referenceBlock.workspace.getAllBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    var otherName = block.getFieldValue('FIELDNAME');
    if (block.isEnabled() && !block.getInheritedDisabled() &&
        otherName && otherName.toLowerCase() === name) {
      count++;
    }
  }
  var msg = (count > 1) ?
      'There are ' + count + ' field blocks\n with this name.' : null;
  referenceBlock.setWarningText(msg);
}

/**
 * Check to see if more than one input has this name.
 * Highly inefficient (On^2), but n is small.
 * @param {!Blockly.Block} referenceBlock Block to check.
 */
function inputNameCheck(referenceBlock) {
  if (!referenceBlock.workspace) {
    // Block has been deleted.
    return;
  }
  var name = referenceBlock.getFieldValue('INPUTNAME').toLowerCase();
  var count = 0;
  var blocks = referenceBlock.workspace.getAllBlocks(false);
  for (var i = 0, block; block = blocks[i]; i++) {
    var otherName = block.getFieldValue('INPUTNAME');
    if (block.isEnabled() && !block.getInheritedDisabled() &&
        otherName && otherName.toLowerCase() === name) {
      count++;
    }
  }
  var msg = (count > 1) ?
      'There are ' + count + ' input blocks\n with this name.' : null;
  referenceBlock.setWarningText(msg);
}

// Make a set of all of block types that are required for the block factory.
var reservedBlockFactoryBlocks =
    new Set(Object.getOwnPropertyNames(Blockly.Blocks));
