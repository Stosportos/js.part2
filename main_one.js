const textBlock = document.querySelector('.text-content');
const buttonReplacer = document.querySelector('.button-replacer');

buttonReplacer.addEventListener('click', () => {
    textBlock.textContent = textBlock.textContent.replace(/\B'|'\B/g, '"');
});