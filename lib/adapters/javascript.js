'use strict';
function JSAdapter(opt) {
    this.opt = opt || {};
    this.opt.name = opt.name || '_html_';
    this.lineOffset = 0;
    this.contentParts = [];
    this.separator = new Buffer(opt.separator);
    this.subobjects = [];
};

JSAdapter.prototype.getHeader = function () {
    return '//HEAD ' + "\n" +
        'window["' + this.opt.name + '"] = {};' + "\n";
};

JSAdapter.prototype.getFile = function (file, content) {
    var ret = '';
    
    file = file.substring(0,file.lastIndexOf("."));
    if( file.indexOf("/") > -1 ){
        
        var folder = file.substring(0, file.indexOf("/"));
        if(this.subobjects.indexOf(folder) === -1){
            this.subobjects.push(folder);
            ret = 'window["' + this.opt.name + '"]["' + folder + '"] = {};' + "\n";
            file = file.substring(file.indexOf("/") + 1); 
        }
        ret += 'window["' + this.opt.name + '"]["'+folder+'"]["' + file + '"] = "' + (Buffer.isBuffer(content) ? content : new Buffer(this.escapeContent(content))) + '"; ' + "\n";

    }
    else{
        ret = 'window["' + this.opt.name + '"]["' + file + '"] = "' + (Buffer.isBuffer(content) ? content : new Buffer(this.escapeContent(content))) + '"; ' + "\n"; 
    }
    
    return ret;
};

JSAdapter.prototype.getFooter = function () {
    return "// END ";
};
JSAdapter.prototype.escapeContent = function (content) {
    var quoteChar = '"';
    var indentString = "  ";
    var bsRegexp = new RegExp('\\\\', 'g');
    var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '\\n' + quoteChar + ' +\n' + indentString + indentString + quoteChar;
    return content.replace(bsRegexp, '\\\\').replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
}
module.exports = JSAdapter;