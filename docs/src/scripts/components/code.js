import hljs from 'highlight.js';
import skate from '../../../../src/index';

function setupCodeBlockContents(element) {
  var pre = document.createElement('pre');
  element.innerHTML = '';
  element.className = 'sk-code-block';
  element.appendChild(pre);
}

function getIndentLength(str) {
  if (str) {
    return str.match(/^\s*/)[0].length;
  }
}

function setIndentLength (len) {
  return len > 0 ? new Array(len + 1).join(' ') : '';
}

export default skate('sk-code', {
  extends: 'noscript',
  properties: {
    showLines: {
      attr: true,
      type: Boolean
    }
  },
  attached: function () {
    var element = this;
    var oldElement;
    var rawHtml = element.innerHTML;
    var lang = element.getAttribute('lang') || 'html';
    var lines = rawHtml.split('\n');
    var showLines = this.showLines;

    if (lang === 'javascript') {
      console.error('To avoid JavaScript evaluation by the browser, script[is="sk-code"] elements must not have lang="javascript".');
    }

    oldElement = element;
    element = document.createElement('div');

    // Trim leading empty lines.
    if (!lines[0].trim()) {
      lines.splice(0, 1);
    }

    // Trim trailing empty lines
    if (!lines[lines.length - 1].trim()) {
      lines.splice(lines.length - 1, 1);
    }

    var baseIndent = getIndentLength(lines[0]);

    setupCodeBlockContents(element);
    var pre = element.querySelector('pre');

    lines.forEach(function (line, index) {
      var indent = getIndentLength(line) - baseIndent;
      var num = document.createElement('code');
      var code = document.createElement('code');
      var nl = document.createTextNode('\n');

      line = line.trim();
      line = line.replace(/&gt;/g, '>');
      line = line.replace(/&lt;/g, '<');

      num.className = 'sk-code-line-number';
      num.innerHTML = index + 1;
      code.className = 'sk-code-line-content ' + lang;
      code.innerHTML = setIndentLength(indent) + hljs.highlight(lang, line).value;

      if (showLines) {
        pre.appendChild(num);
      }

      pre.appendChild(code);
      pre.appendChild(nl);
    });

    if (oldElement) {
      oldElement.parentNode.insertBefore(element, oldElement);
    }
  }
});
