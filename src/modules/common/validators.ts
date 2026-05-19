export const patterns = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
  NAME: /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]{1,50}$/,
  USERNAME: /^[a-zA-Z0-9_\-]{3,30}$/,
  DNI: /^\d{8}$/,
  RUC_DOC: /^\d{11}$/,
};

export const messages = {
  PASSWORD: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  NAME: 'El nombre solo puede contener letras y espacios',
  USERNAME: 'El username solo puede contener letras, números, guiones y guiones bajos',
  DNI: 'El DNI debe tener exactamente 8 dígitos',
  RUC: 'El RUC debe tener exactamente 11 dígitos',
};
