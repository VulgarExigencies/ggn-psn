// ==UserScript==
// @name GGn PSN Language BBCode quick copy
// @match https://www.playstation.com/en-*/games/*
// @match https://store.playstation.com/en-*/product/*
// @match https://store.playstation.com/en-*/concept/*
// @version          0.2
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
  'use strict';

  const parseLanguageList = languages => languages.split(',').map(l => l.trim());
  const pluralize = languages => parseLanguageList(languages).length > 1;

  const voiceLanguagesSelector = '[data-qa="gameInfo#releaseInformation#voice-value"]';
  const screenLanguageSelector = '[data-qa="gameInfo#releaseInformation#subtitles-value"]';
  const getLanguages = selector => document.querySelectorAll(selector)[0].innerText;

  const getBbCode = () => {
    const voiceLanguages = getLanguages(voiceLanguagesSelector);
    const screenLanguages = getLanguages(screenLanguageSelector);

    if (voiceLanguages === screenLanguages) {
      const prefix = pluralize(voiceLanguages) ? 'Languages' : 'Language';

      return `[b]${prefix}[/b]: ${voiceLanguages}`;
    }

    const voicePrefix = pluralize(voiceLanguages) ? 'Audio Languages' : 'Audio Language';
    const screenPrefix = pluralize(screenLanguages) ? 'Screen Languages' : 'Screen Language';

    return `[b]${screenPrefix}[/b]: ${screenLanguages}
[b]${voicePrefix}[/b]: ${voiceLanguages}`;
  }

  const makeGazelleNode = () => {
    const gazelleNode = document.querySelectorAll('[data-qa="gameInfo#releaseInformation#voice-key"]')[0].cloneNode();
    gazelleNode.innerText = 'Gazelle:';

    return gazelleNode;
  };

  const makeActionsNode = () => {
    const actionsNode = document.querySelectorAll(voiceLanguagesSelector)[0].cloneNode();
    actionsNode.innerHTML = '';

    const bbCodeButton = document.createElement('button');
    bbCodeButton.style.display = 'flex';
    const text = 'Copy BBCode';
    const textNode = bbCodeButton.appendChild(document.createElement('span'));
    textNode.innerHTML = `${text}<img src="https://ptpimg.me/sx226x.png">`;
    bbCodeButton.addEventListener('click', () => {
      GM_setClipboard(getBbCode(), 'text');
      textNode.childNodes[0].nodeValue = 'copied';
      setTimeout(function(){textNode.childNodes[0].nodeValue = text; }, 3000);
    })
    actionsNode.appendChild(bbCodeButton);

    return actionsNode;
  };


  const makeGGnActions = () => {
    const targetDl = document.querySelectorAll('[data-qa="gameInfo#releaseInformation"]')[0];

    targetDl.appendChild(makeGazelleNode());
    targetDl.appendChild(makeActionsNode());
  };

  makeGGnActions();
})();
