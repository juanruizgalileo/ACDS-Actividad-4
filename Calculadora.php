<?php

class Calculadora {
    public function sumar($num1, $num2) {
        return $num1 + $num2;
    }

    public function restar($num1, $num2) {
        return $num1 - $num2;
    }

    public function multiplicar($num1, $num2) {
        return $num1 * $num2;
    }

    public function dividir($num1, $num2) {
        //if ($num2 == 0) {
        //    return "Error: No se puede dividir por cero";
        //}
        return $num1 / $num2;
    }

    public function sumarArreglo($numeros) {
        $resultado = 0;
        foreach ($numeros as $numero) {
            $resultado += $numero;
        }
        return $resultado;
    }

    public function multiplicarArreglo($numeros) {
        $resultado = 1;
        foreach ($numeros as $numero) {
            $resultado *= $numero;
        }
        return $resultado;
    }
}

?>
