import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {

  @Input() type: 'fetchError' | 'notFoundError' | undefined;

  errorHeader: string = "Opps!"
  errorText: string = "An Error has occured"

  ngOnInit(): void {
    if (this.type == "fetchError") {
      this.setFetchError();
    }
    if (this.type == "notFoundError") {
      this.setNotFoundError();
    }
  }

  setFetchError() {
    this.errorText = "Looks like we ran into some problems fetching the data."
  }

  setNotFoundError() {
    this.errorHeader = "404 Not Found"
    this.errorText = "The page you are looking for doesn't exist."
  }
}
