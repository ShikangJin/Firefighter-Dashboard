const flashTemplate = [
    '<?xml version="1.0"?>',
    '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
    '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35">',
    '<animate attributeType="XML" attributeName="fill" values="#800;#f00;#800;#800" dur="0.8s" repeatCount="indefinite"/>',
    '</circle>',
    '</svg>'
].join('\n');

const normalTemplate = [
    '<?xml version="1.0"?>',
    '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
    '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35">',
    '</circle>',
    '</svg>'
].join('\n');

const flashSvgColor = '#e60017';
const normalSvgColor = '#00cc25';

const flashSvg = flashTemplate.replace('{{ color }}', flashSvgColor);
const normalSvg = normalTemplate.replace('{{ color }}', normalSvgColor);

export {
    flashSvg,
    normalSvg,
}