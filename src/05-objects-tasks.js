/* eslint-disable max-classes-per-file */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
  *           builder.combine(
  *               builder.element('tr').pseudoClass('nth-of-type(even)'),
  *               ' ',
  *               builder.element('td').pseudoClass('nth-of-type(even)')
  *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  MySelector: class {
    constructor(method, value) {
      this.elementField = '';
      this.idField = '';
      this.classField = [];
      this.attrField = [];
      this.pseudoClassField = [];
      this.pseudoElementField = '';
      if (method === 'id') {
        this[`${method}Field`] = `#${value}`;
      } else if (method === 'pseudoElement') {
        this[`${method}Field`] = `::${value}`;
      } else if (method === 'element') {
        this[`${method}Field`] = value;
      } else if (method === 'class') {
        this.classField.push(`.${value}`);
      } else if (method === 'attr') {
        this.attrField.push(`[${value}]`);
      } else if (method === 'pseudoClass') {
        this.pseudoClassField.push(`:${value}`);
      }
    }


    element(value) {
      // eslint-disable-next-line max-len
      if (this.idField || this.classField.length > 0 || this.attrField.length > 0 || this.pseudoClassField.length > 0 || this.pseudoElementField) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      if (this.elementField) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      this.elementField = value;
      return this;
    }

    id(value) {
      // eslint-disable-next-line max-len
      if (this.classField.length > 0 || this.attrField.length > 0 || this.pseudoClassField.length > 0 || this.pseudoElementField) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      if (this.idField) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      this.idField = `#${value}`;
      return this;
    }

    class(value) {
      // eslint-disable-next-line max-len
      if (this.attrField.length > 0 || this.pseudoClassField.length > 0 || this.pseudoElementField) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.classField.push(`.${value}`);
      return this;
    }

    attr(value) {
      if (this.pseudoClassField.length > 0 || this.pseudoElementField) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.attrField.push(`[${value}]`);
      return this;
    }

    pseudoClass(value) {
      if (this.pseudoElementField) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.pseudoClassField.push(`:${value}`);
      return this;
    }

    pseudoElement(value) {
      if (this.pseudoElementField) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      this.pseudoElementField = `::${value}`;
      return this;
    }

    stringify() {
      return `${this.elementField}${this.idField}${this.classField.join('')}${this.attrField.join('')}${this.pseudoClassField.join('')}${this.pseudoElementField}`;
    }
  },

  element(value) {
    return new this.MySelector('element', value);
  },

  id(value) {
    return new this.MySelector('id', value);
  },

  class(value) {
    return new this.MySelector('class', value);
  },

  attr(value) {
    return new this.MySelector('attr', value);
  },

  pseudoClass(value) {
    return new this.MySelector('pseudoClass', value);
  },

  pseudoElement(value) {
    return new this.MySelector('pseudoElement', value);
  },

  Combination: class {
    constructor(selector1, combinator, selector2) {
      this.selector1 = selector1;
      this.combinator = combinator;
      this.selector2 = selector2;
    }

    stringify() {
      return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
    }
  },

  combine(selector1, combinator, selector2) {
    return new this.Combination(selector1, combinator, selector2);
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
