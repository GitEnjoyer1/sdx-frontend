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

  constructor() {}

  errorHeader: string = "404 Not Found"
  errorText: string = "The page you are looking for doesn't exist."

  ngOnInit(): void {
    if (this.type == "fetchError") {
      this.setFetchError();
    }
  }

  setFetchError() {
    this.errorText = "Looks like we ran into some problems fetching the data."
  }
}
