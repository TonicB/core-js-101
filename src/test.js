function encodeToRot13(str) {
  const template = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
  const templateUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return str.replace(/[A-Z|a-z]/g, (x) => {
    if (/[A-Z]/.test(x)) {
      return templateUp.at(templateUp.indexOf(x) + 13);
    }
    return template.at(template.indexOf(x) + 13);
  });
}
// eslint-disable-next-line no-console
console.log(encodeToRot13('Why did the chicken cross the road?'));
