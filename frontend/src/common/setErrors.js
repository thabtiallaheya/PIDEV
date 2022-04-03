export const validatrosCreate = (subject, title, file, limiteDate) => {
  let errorrs = {};
  errorrs.subject = title ? '' : 'Subject is required';
  errorrs.title = title ? '' : 'Title is required';
  errorrs.file = file ? '' : 'File is required';
  //errorrs.creationDate = creationDate ? '' : 'creation Date is required';
  errorrs.limiteDate = limiteDate ? '' : 'limite Date is required';
  return errorrs;
};
export const validatrosUpdate = (subject, title, limiteDate) => {
  let errorrs = {};
  errorrs.subject = subject ? '' : 'Subject is required';
  errorrs.title = title ? '' : 'Title is required';
  //errorrs.file = file ? '' : 'File is required';
  //errorrs.creationDate = creationDate ? '' : 'creation Date is required';
  errorrs.limiteDate = limiteDate ? '' : 'limite Date is required';
  return errorrs;
};
