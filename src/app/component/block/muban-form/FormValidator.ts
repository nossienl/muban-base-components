// @ts-ignore-start
import merge from 'lodash/merge';
import validate from 'validate.js';
import Disposable from 'seng-disposable';

interface ValidationResult {
  valid: boolean;
  errors?: {
    [name: string]: Array<string>;
  };
}

interface Constraint {
  [name: string]: any;
}

interface Constraints {
  [attribute: string]: Constraint;
}

/**
 * Default constraints should include most situations.
 */
const rulesPreset = {
  required: {
    presence: true,
  },
  email: {
    email: true,
  },
  phoneNumber: {
    format: {
      pattern: '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$',
      flags: 'i',
    },
  },
  requiredCheckbox: {
    presence: true,
    inclusion: {
      within: ['true', true],
      message: 'You need to check the checkbox',
    },
  },
};

class FormValidator extends Disposable {
  private static SELECTOR: string = 'validate';
  private readonly form: HTMLFormElement;
  private readonly rules: Constraints;

  private constraints: Constraints;

  constructor(form: HTMLFormElement, customRules: Constraints = {}) {
    super();

    if (!form) throw new Error('Form is required');

    this.form = form;
    this.rules = merge(rulesPreset, customRules);
    // console.log(this.rules);
    this.updateConstraints();
  }

  /**
   * @public
   * @method validate
   */
  public validate(): Promise<ValidationResult> {
    // console.log(this.constraints);
    const errors = validate(this.form, this.constraints);
    return Promise.resolve({ errors, valid: errors === undefined });
  }

  /**
   * @public
   * @method updateConstraints
   */
  public updateConstraints(): void {
    const fields = [...this.form.querySelectorAll(`[data-${FormValidator.SELECTOR}]`)];

    this.constraints = fields.reduce((accumulator, currentField: HTMLElement) => {
      accumulator[currentField.getAttribute('name')] = this.parseElementConstraint(currentField);
      return accumulator;
    }, {});
  }

  /**
   * @private
   * @method parseElementConstraints
   */
  private parseElementConstraint(element: HTMLElement): Constraint {
    const dataset = element.dataset[FormValidator.SELECTOR];
    const rules = dataset.includes('|') ? dataset.split('|') : [dataset];

    return rules.reduce((accumulator, currentRule: string) => {
      if (!this.rules[currentRule])
        throw new Error(`Rule: ${currentRule} was not found in the constraints config`);
      return { ...accumulator, ...this.rules[currentRule] };
    }, {});
  }
}
export default FormValidator;
// @ts-ignore-end
