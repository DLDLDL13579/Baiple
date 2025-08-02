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
        value=value+'import matplotlib.pyplot as plt\n';
    }
    else if (sframework=='Keras'){
        value=value+'import tensorflow as tf\n';
        value=value+'from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout\n';
        value=value+'from tensorflow.keras.models import Model\n';
        value=value+'from tensorflow.keras.preprocessing.image import ImageDataGenerator\n';
        value=value+'from tensorflow.keras.optimizers import Adam\n';    
    }
    else if (sframework=='Scikit-Learn'){
        value=value+'import sklearn\n';
        value=value+'import numpy as np\n';
        value=value+'from sklearn.model_selection import train_test_split\n';
        value=value+'from sklearn.metrics import mean_squared_error,r2_score\n';
        value=value+'import matplotlib.pyplot as plt\n';
        value=value+'from sklearn.preprocessing import StandardScaler\n\n';
    }
    else if (sframework=='AlexNet5'){
        value=value+'import tensorflow as tf\n';
        value=value+'from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout\n';
        value=value+'from tensorflow.keras.models import Model\n';
        value=value+'from tensorflow.keras.preprocessing.image import ImageDataGenerator\n';
        value=value+'from tensorflow.keras.optimizers import Adam\n';
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
        value=value+'ds = load_'+dataset+'()\n';
        value=value+'X, y = ds.data, ds.target\n';
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
            value=value+'    "num_epochs": 80,\n';
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
        value=value+'#导内置Linnerud数据集包\n';
        value=value+'from sklearn.datasets import load_linnerud\n';  
        value=value+'# 加载数据集\n';
        value=value+'linnerud = load_linnerud()\n';
        value=value+'# 选择对生理指标进行聚类（data数组）\n';
        value=value+'# 生理指标：体重、腰围、脉搏\n';
        value=value+'X = linnerud.data\n';
        value=value+'y = linnerud.target#该两条语句分类的时候不使用，在聚类时用\n';
        value=value+'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size='+test_size+', random_state=42)\n';
    }else if (dataset=='Zebra'){
        value=value+'# 单元2.加载数据集、数据预处理\n';
        value=value+'class ZebraDataset:\n';
        value=value+'    def __init__(self, data_dir):\n';
        value=value+'        self.data_dir = data_dir\n';
        value=value+'        self.samples = []\n';
        value=value+'                   \n';
        value=value+'        # 加载正样本（斑马线）\n';
        value=value+'        zebra_dir = os.path.join(data_dir, "zebra")\n';
        value=value+'        zebra_label_dir = os.path.join(data_dir, "zebra_label")\n';
        value=value+'        self._load_samples(zebra_dir, zebra_label_dir, is_positive=True)\n';
        value=value+'                        \n';
        value=value+'        # 加载负样本（其他）\n';
        value=value+'        others_dir = os.path.join(data_dir, "others")\n';
        value=value+'        others_label_dir = os.path.join(data_dir, "others_label")\n';
        value=value+'        self._load_samples(others_dir, others_label_dir, is_positive=False)\n';
        value=value+'                                                  \n';
        value=value+'    def _load_samples(self, img_dir, label_dir, is_positive):\n';
        value=value+'        for img_name in os.listdir(img_dir):\n';
        value=value+'            if img_name.endswith(".png"):\n';
        value=value+'                img_path = os.path.join(img_dir, img_name)\n';
        value=value+'                xml_path = os.path.join(label_dir, img_name.replace(".png", ".xml"))\n';
        value=value+'                                             \n';
        value=value+'                if not os.path.exists(xml_path):\n';
        value=value+'                    continue\n';
        value=value+'                                     \n';
        value=value+'                tree = ET.parse(xml_path)\n';
        value=value+'                root = tree.getroot()\n';
        value=value+'                                 \n';
        value=value+'                # 解析图像尺寸\n';
        value=value+'                size = root.find("size")\n';
        value=value+'                width = int(size.find("width").text)\n';
        value=value+'                height = int(size.find("height").text)\n';
        value=value+'                             \n';
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
        value=value+'#数据预处理           \n';
        value=value+'    def load_data(self):\n';
        value=value+'        images, labels = [], []\n';
        value=value+'        for img_path, label, (w, h) in self.samples:\n';
        value=value+'            img = cv2.imread(img_path)\n';
        value=value+'            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)\n';
        value=value+'                           \n';
        value=value+'            # 预处理\n';
        value=value+'            img = cv2.resize(img, (IMG_SIZE, IMG_SIZE)) / 255.0\n';
        value=value+'                               \n';
        value=value+'            # 归一化坐标（仅正样本）\n';
        value=value+'            if label[0] == 1:\n';
        value=value+'                norm_coords = [\n';
        value=value+'                    label[1] / w, label[2] / h,\n';
        value=value+'                    label[3] / w, label[4] / h\n';
        value=value+'                ]\n';
        value=value+'                labels.append([1] + norm_coords)\n';
        value=value+'            else:\n';
        value=value+'                labels.append([0, 0, 0, 0, 0])\n';
        value=value+'                                 \n';
        value=value+'            images.append(img)\n';
        value=value+'                                    \n';
        value=value+'        return np.array(images), np.array(labels)\n';
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
    }
    else{
        value=value+sframework+'\n';
    }
    return value;
}; 
Blockly.Python['ai_buildmodel'] = function(block) {
    var buildmodel = block.getFieldValue('NAME');    
    var value='';    
    if (buildmodel=='custom'){
        value=value+'custom\n';
    }else if (buildmodel=='kmeans'){
        value=value+'from sklearn.cluster import KMeans\n\n';

        value=value+'# 初始化 KMeans 算法，设定聚类数量为 3（可以根据需要调整）\n';
        value=value+'kmeans = KMeans(n_clusters=3, random_state=42)\n\n';
        //=value+'kmeans = KMeans(n_clusters=3)  # 假设我们知道有3个簇';
                
    }else if (buildmodel=='LinearRegression'){
        value=value+'from sklearn.linear_model import LinearRegression\n\n';
        value=value+'# 初始化线性回归模型\n';
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
    else if (buildmodel=='Keras'){
        value=value+'# 定义神经网络模型\n';
        value=value+'def build_model():\n';
        value=value+'model = models.Sequential([\n';
        value=value+'    layers.Dense(params[\'hidden_nodes\'], activation=\'relu\', input_shape=(28 * 28,)),\n';
        value=value+'    layers.Dense(10, activation=\'softmax\')\n';
        value=value+'])\n';
        value=value+'return model\n\n';

        value=value+'# 创建模型并编译\n';
        value=value+'model = build_model()\n';
        value=value+'model.compile(optimizer=keras.optimizers.SGD(learning_rate=params[\'learning_rate\']),\n';
        value=value+'              loss=\'sparse_categorical_crossentropy\',\n';
        value=value+'             metrics=[\'accuracy\'])\n\n';
    }
    else if (buildmodel=='AlexNet5'){
        value=value+'# 构建AlexNet模型\n';
        value=value+'def AlexNet(input_shape=(224, 224, 3), num_classes=2):\n';
        value=value+'inputs = Input(shape=input_shape)\n\n';
    
        value=value+'# 第一层卷积和池化\n';
        value=value+'x = Conv2D(96, (11, 11), strides=(4, 4), activation=\'relu\', padding=\'same\')(inputs)\n';
        value=value+'x = MaxPooling2D((3, 3), strides=(2, 2))(x)\n';
        value=value+'x = Dropout(0.25)(x)\n\n';
    
        value=value+'# 第二层卷积和池化\n';
        value=value+'x = Conv2D(256, (5, 5), strides=(1, 1), activation=\'relu\', padding=\'same\')(x)\n';
        value=value+'x = MaxPooling2D((3, 3), strides=(2, 2))(x)\n';
        value=value+'x = Dropout(0.25)(x)\n\n';
    
        value=value+'# 第三层卷积\n';
        value=value+'x = Conv2D(384, (3, 3), strides=(1, 1), activation=\'relu\', padding=\'same\')(x\n\n';
    
        value=value+'# 第四层卷积\n';
        value=value+'x = Conv2D(384, (3, 3), strides=(1, 1), activation=\'relu\', padding=\'same\')(x)\n';
    
        value=value+'# 第五层卷积和池化\n';
        value=value+'x = Conv2D(256, (3, 3), strides=(1, 1), activation=\'relu\', padding=\'same\')(x)\n';
        value=value+'x = MaxPooling2D((3, 3), strides=(2, 2))(x)\n';
        value=value+'x = Dropout(0.25)(x)\n\n';
    
        value=value+'# 全连接层\n';
        value=value+'x = Flatten()(x)\n';
        value=value+'x = Dense(4096, activation=\'relu\')(x)\n';
        value=value+'x = Dropout(0.5)(x)\n';
        value=value+'x = Dense(4096, activation=\'relu\')(x)\n';
        value=value+'x = Dropout(0.5)(x)\n\n';
    
        value=value+'# 输出层\n';
        value=value+'outputs = Dense(num_classes, activation=\'sigmoid\')(x)  # 对于二分类，使用sigmoid激活函数\n';
    
        value=value+'model = Model(inputs, outputs)\n';
        value=value+'return model\n\n';

        value=value+'# 实例化模型\n';
        value=value+'model = AlexNet()\n\n';

        value=value+'# 编译模型\n';
        value=value+'model.compile(optimizer=Adam(lr=0.001),  # 可以调整学习率\n';
        value=value+'loss=\'binary_crossentropy\',  # 二分类任务使用二元交叉熵损失\n';
        value=value+'metrics=[\'accuracy\'])\n';
                
    }
    return value;
};
Blockly.Python['ai_trainmodel'] = function(block) {
    var trainmodel = block.getFieldValue('NAME');    
    var value='\n';    
    if (trainmodel=='custom'){
        value=value+'custom\n';
    }else if (trainmodel=='kmeans'){
        value=value+'# 数据标准化\n';
        value=value+'scaler = StandardScaler()\n';
        value=value+'X_scaled = scaler.fit_transform(X_train)\n\n';
        value=value+'# 训练模型\n';
        value=value+'kmeans.fit(X_scaled)\n';
        value=value+'# 获取聚类结果)\n';
        value=value+'cluster_labels = kmeans.labels_)\n';
    }else if (trainmodel=='LinearRegression'||trainmodel=='LogisticRegression'||trainmodel=='KNN'||trainmodel=='CART'){
        value=value+'# 训练模型\n';       
        value=value+'model.fit(X_train, y_train)\n';
    }
    else if (trainmodel=='AlexNet5'){
        value=value+'# 训练模型\n';
        value=value+'model.fit(train_generator,epochs=20,validation_data=validation_generator)# 训练的轮数20,可调整\n';
    }
    return value;
}
Blockly.Python['ai_predictmodel'] = function(block) {
    var predictmodel = block.getFieldValue('NAME');    
    var value='';    
    if (predictmodel=='custom'){
        value=value+'custom\n';
    }else if (predictmodel=='kmeans'){
        
        value=value+'# 可视化聚类结果（选择前两个特征进行可视化）\n';
        value=value+'plt.figure(figsize=(8, 6))\n';
        value=value+'plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=cluster_labels, cmap=\'viridis\', marker=\'o\', edgecolor=\'k\', s=50)\n';

        value=value+'# 标记聚类中心\n';
        value=value+'centers = kmeans.cluster_centers_\n';
        value=value+'plt.scatter(centers[:, 0], centers[:, 1], c=\'red\', s=200, alpha=0.75, marker=\'X\', label=\'Centroids\')\n';

        value=value+'plt.xlabel(\'特征 1\')\n';
        value=value+'plt.ylabel(\'特征 2\')\n';
        value=value+'plt.title(\'数据集中前两个指标的K-Means聚类结果\')\n';
        value=value+'plt.legend()\n';
        value=value+'plt.grid(True)\n';
        value=value+'plt.savefig(\'output.png\')\n';
    }
    else if (predictmodel=='LinearRegression'||predictmodel=='LogisticRegression'||predictmodel=='KNN'||predictmodel=='CART'){
        value=value+'# 对测试集进行预测\n';
        value=value+'y_pred = model.predict(X_test)\n\n';

        value=value+'# 打印模型的系数\n';
        value=value+'print("系数:", model.coef_)\n';
        value=value+'print("截距:", model.intercept_)\n\n';

        value=value+'# 计算模型的均方误差和R^2值\n';
        value=value+'mse = mean_squared_error(y_test, y_pred)\n';
        value=value+'r2 = r2_score(y_test, y_pred)\n';

        value=value+'print("均方误差:", mse)\n';
        value=value+'print("R^2 Score(决定系数):", r2)\n\n';
        value=value+'# 评估模型\n';
        value=value+'accuracy = accuracy_score(y_test, y_pred)\n';
        value=value+'report = classification_report(y_test, y_pred)\n';

        value=value+'print(f"分类精度: {accuracy}")\n';
        value=value+'print("分类报告:")\n';
        value=value+'print(report)\n\n';

        value=value+'# 可视化预测结果\n';
        value=value+'plt.scatter(y_test, y_pred)\n';
        value=value+'plt.xlabel("实际值")\n';
        value=value+'plt.ylabel("预测值")\n';
        value=value+'plt.title("预测值 vs 实际值")\n';
        value=value+'plt.savefig(\'output.png\')\n';
    }
    return value;
}
Blockly.Python['ai_savemodel'] = function(block) {
    var savemodel = block.getFieldValue('NAME');    
    var value='';    
    if (savemodel=='custom'){
        value=value+'custom\n';
    }else if (savemodel=='AlexNet5'){
        value=value+'# 保存模型\n';
        value=value+'model.save(\'alexnet_cat_dog_classifier.h5\')\n';
    }
    else{
        value=value+savemodel+'\n';
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
