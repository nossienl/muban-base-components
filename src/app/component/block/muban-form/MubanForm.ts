import AbstractBlock from '../AbstractBlock';
import validate from 'validate.js';

export default class MubanForm extends AbstractBlock {
  static displayName: string = 'muban-form';
  private form: HTMLFormElement;
  private constraints: {};

  constructor(el: HTMLElement) {
    super(el);

    this.form = el as HTMLFormElement;

    this.getConstraintsForForm();

    this.addEventListener(el, 'submit', this.handleFormSubmit.bind(this));
  }

  /**
   * @public
   * @method getConstraintsForForm
   */
  public getConstraintsForForm(): void {
    // TODO Generate constraints based on fields in form
    this.constraints = {
      firstName: {
        presence: true,
      },
      email: {
        presence: true,
        email: true,
      },
      phoneNumber: {
        presence: false,
        format: {
          pattern: '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$',
          flags: 'i',
        },
      },
      policy: {
        presence: true,
        inclusion: {
          within: ['true', true],
          message: 'You need to check the checkbox',
        },
      },
    };
  }

  /**
   * @public
   * @method handleFormSubmit
   */
  public handleFormSubmit(event): void {
    event.preventDefault();
    this.validateForm();
  }

  /**
   * @public
   * @method validateForm
   */
  public validateForm(): void {
    const errors = validate(this.form, this.constraints);
  }

  public dispose() {
    super.dispose();
  }
}
