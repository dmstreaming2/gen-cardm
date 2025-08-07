function generarTarjetas() {
  const binInput = document.getElementById("bin").value.trim();
  const cvvFijo = document.getElementById("cvv").value.trim();
  const expiryInput = document.getElementById("expiry").value.trim();
  const cantidadInput = parseInt(document.getElementById("cantidad").value, 10);
  const resultado = document.getElementById("resultado");

  const cantidad = isNaN(cantidadInput) || cantidadInput < 1 || cantidadInput > 100 ? 10 : cantidadInput;
  const tarjetas = [];

  if (!/^\d{6,}[xX\d]*$/.test(binInput)) {
    resultado.textContent = "Por favor, ingresa un BIN válido (mínimo 6 dígitos).";
    return;
  }

  for (let i = 0; i < cantidad; i++) {
    const tarjeta = generarNumeroDesdeBIN(binInput);
    const fecha = validarFecha(expiryInput) ? expiryInput : generarFechaRandom();
    const cvv = /^\d{3}$/.test(cvvFijo) ? cvvFijo : generarCVV();

    tarjetas.push(`${tarjeta} | ${fecha} | ${cvv}`);
  }

  resultado.textContent = tarjetas.join('\n');

}

// Genera tarjeta con algoritmo Luhn
function generarNumeroDesdeBIN(bin) {
  let numero = "";

  for (let char of bin) {
    numero += (char.toLowerCase() === "x")
      ? Math.floor(Math.random() * 10)
      : char;
  }

  // Si el número tiene menos de 15 dígitos, completa hasta 15
  while (numero.length < 15) {
    numero += Math.floor(Math.random() * 10);
  }

  // Agrega dígito Luhn
  const digitoControl = obtenerDigitoLuhn(numero);
  return numero + digitoControl;
}

// Algoritmo Luhn para calcular el último dígito
function obtenerDigitoLuhn(num) {
  const arr = num.split("").reverse().map(Number);
  const suma = arr.reduce((acc, val, i) => {
    if (i % 2 === 0) return acc + val;
    let doble = val * 2;
    if (doble > 9) doble -= 9;
    return acc + doble;
  }, 0);

  return (10 - (suma % 10)) % 10;
}

function generarFechaRandom() {
  const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const año = String(Math.floor(Math.random() * 5) + 25);
  return `${mes}/${año}`;
}

function generarCVV() {
  return String(Math.floor(100 + Math.random() * 900));
}

function validarFecha(fecha) {
  return /^\d{2}\/\d{2}$/.test(fecha);
}

// Detectar tipo de tarjeta
function detectarTipoTarjeta(bin) {
  const tipo = document.getElementById('tipo-tarjeta');
  if (/^4/.test(bin)) {
    tipo.textContent = "Tipo: Visa";
  } else if (/^5[1-5]/.test(bin) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(bin)) {
    tipo.textContent = "Tipo: Mastercard";
  } else if (/^3[47]/.test(bin)) {
    tipo.textContent = "Tipo: American Express";
  } else if (/^6(?:011|5)/.test(bin) || /^622(?:12[6-9]|1[3-9]\d|[2-8]\d{2}|9[01]\d|92[0-5])/.test(bin)) {
    tipo.textContent = "Tipo: Discover";
  } else if (/^35/.test(bin)) {
    tipo.textContent = "Tipo: JCB";
  } else {
    tipo.textContent = "Tipo: Desconocido";
  }
}

// Formateo de fecha
document.getElementById('expiry').addEventListener('input', function (e) {
  let input = e.target.value.replace(/\D/g, '');
  if (input.length > 4) input = input.slice(0, 4);
  if (input.length >= 3) {
    e.target.value = input.slice(0, 2) + '/' + input.slice(2);
  } else {
    e.target.value = input;
  }
});

// Detectar tipo de tarjeta en tiempo real
document.getElementById('bin').addEventListener('input', function (e) {
  const valor = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
  detectarTipoTarjeta(valor);
});
  