import Big, { BigSource, RoundingMode } from 'big.js';

class MathOp {
  value: BigSource;

  constructor(x: BigSource) {
    this.value = !isNaN(+x) ? x : 0;
  }

  add(x: BigSource) {
    try {
      this.value = Big(this.value).plus(x);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  sub(x: BigSource) {
    try {
      this.value = Big(this.value).minus(x);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  mul(x: BigSource) {
    try {
      this.value = Big(this.value).times(x);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  div(x: BigSource) {
    try {
      this.value = Big(this.value).div(x);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  sum(...args: BigSource[]) {
    try {
      this.value = args.reduce((sum, current) => Big(sum).plus(current), 0);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  mod(modDigit: number) {
    try {
      this.value = Big(this.value).mod(modDigit);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  round(decimalPlaces?: number, roundingMode?: RoundingMode) {
    try {
      this.value = Big(this.value).round(decimalPlaces, roundingMode);
    } catch (err) {
      console.error(err);
    }
    return this;
  }

  eq(x: BigSource) {
    try {
      return Big(this.value).eq(x);
    } catch (err) {
      console.error(err);
      return this.value === x;
    }
  }

  gt(x: BigSource) {
    try {
      return Big(this.value).gt(x);
    } catch (err) {
      console.error(err);
      return this.value > x;
    }
  }

  gte(x: BigSource) {
    try {
      return Big(this.value).gte(x);
    } catch (err) {
      console.error(err);
      return this.value >= x;
    }
  }

  lt(x: BigSource) {
    try {
      return Big(this.value).lt(x);
    } catch (err) {
      console.error(err);
      return this.value < x;
    }
  }

  lte(x: BigSource) {
    try {
      return Big(this.value).lte(x);
    } catch (err) {
      console.error(err);
      return this.value <= x;
    }
  }

  toNumber() {
    try {
      return Big(this.value).toNumber();
    } catch (err) {
      console.error(err);
      return +this.value;
    }
  }

  toString() {
    try {
      return Big(this.value).toString();
    } catch (err) {
      console.error(err);
      return '-';
    }
  }

  toFixed(toFixedDigit: number) {
    try {
      return Big(this.value).toFixed(toFixedDigit);
    } catch (err) {
      console.error(err);
      return this.value;
    }
  }
}

export default MathOp;
