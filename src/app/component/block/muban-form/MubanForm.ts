import AbstractBlock from '../AbstractBlock';
import FormValidator from './FormValidator';

export default class MubanForm extends AbstractBlock {
  static displayName: string = 'muban-form';
  private readonly form: FormValidator;

  constructor(el: HTMLFormElement) {
    super(el);

    this.form = new FormValidator(el);

    this.addEventListener(el, 'submit', this.handleFormSubmit.bind(this));
  }

  /**
   * @public
   * @method handleFormSubmit
   */
  public handleFormSubmit(event): void {
    event.preventDefault();
    this.form.validate().then(result => {
      if (!result.valid) {
        Object.keys(result.errors).forEach(fieldName => {
          this.getElement(`[name=${fieldName}]`).classList.add('error');
        });
      }
      // console.log(result);
    });
  }

  public dispose() {
    super.dispose();
  }
}
