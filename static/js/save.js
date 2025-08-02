function downloadCode() {
    var e = Blockly.Python.workspaceToCode().replace(/(\w+) = None/g, '')
  
    o = [];
  o.push(e);
  var t = new Blob(o, { type: "text/plain;charset=utf-8" }),
    n = document.getElementById("program_name").value;
  n = n ? removeExtension(n) : "Example";
  saveAs(t, n + ".py");
}

function removeExtension(e) {
  var o = e.lastIndexOf(".");
  return -1 === o ? e : e.substr(0, o);
}
function newXmlBlocks() {
    document.getElementById("program_name").value ="newblockly.xml";
    Blockly.mainWorkspace.clear();
}
function saveXmlBlocks() {
  var e = document.getElementById("program_name").value,
    o = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  e = e ? removeExtension(e) : "Blockly";
  var t = Blockly.Xml.domToPrettyText(o),
    n = new Blob([t], { type: "text/plain;charset=utf-8" });
  0 != n.size && saveAs(n, e + ".xml");
}
function loadbackground() {
    var e = document.getElementById("bgFile");
    e.click();
}
function loadXmlBlocks() {
  var e = document.getElementById("load");
  e.addEventListener("change", loadXmlDom, !1), e.click();
}
function loadXmlDom(e) {
  var o = e.target.files;
  if (1 == o.length) {
    document.getElementById("program_name").value =
      removeExtension(o[0].name) + ".xml";
    var t = new FileReader();
    (t.onloadend = function (e) {
      var o = e.target;
      if (2 == o.readyState) {
        try {
          var t = Blockly.Xml.textToDom(o.result);
        } catch (e) {
          return void alert("∆ ŒˆXMLÂe’`:\n" + e);
        }
        Blockly.mainWorkspace.getAllBlocks().length &&
          Blockly.mainWorkspace.clear(),
          Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, t);
      }
      document.getElementById("load").value = "";
    }),
      t.readAsText(o[0]);
  }

}