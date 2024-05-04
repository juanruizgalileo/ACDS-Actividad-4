<?php

use PHPUnit\Framework\TestCase;

require_once 'Calculadora.php';

class CalculadoraTest extends TestCase {
    public function testSumar() {
        $calculadora = new Calculadora();
        $this->assertEquals(5, $calculadora->sumar(2, 3));
        $this->assertEquals(-1, $calculadora->sumar(2, -3));
        $this->assertEquals(0, $calculadora->sumar(0, 0));
    }

    public function testRestar() {
        $calculadora = new Calculadora();
        $this->assertEquals(-1, $calculadora->restar(2, 3));
        $this->assertEquals(5, $calculadora->restar(2, -3));
        $this->assertEquals(0, $calculadora->restar(0, 0));
    }

    public function testMultiplicar() {
        $calculadora = new Calculadora();
        $this->assertEquals(6, $calculadora->multiplicar(2, 3));
        $this->assertEquals(-6, $calculadora->multiplicar(2, -3));
        $this->assertEquals(0, $calculadora->multiplicar(0, 0));
    }

    public function testDividir() {
        $calculadora = new Calculadora();
        $this->assertEquals(2, $calculadora->dividir(6, 3));
        $this->assertEquals(-2, $calculadora->dividir(6, -3));
        $this->assertEquals("Error: No se puede dividir por cero", $calculadora->dividir(6, 0));
        $this->assertEquals(0.5, $calculadora->dividir(1, 2));
    }

    public function testSumarArreglo() {
        $calculadora = new Calculadora();
        $numeros = [1, 2, 3, 4, 5];
        $this->assertEquals(15, $calculadora->sumarArreglo($numeros));
    }

    public function testMultiplicarArreglo() {
        $calculadora = new Calculadora();
        $numeros = [1, 2, 3, 4, 5];
        $this->assertEquals(120, $calculadora->multiplicarArreglo($numeros));
    }
}

?>

