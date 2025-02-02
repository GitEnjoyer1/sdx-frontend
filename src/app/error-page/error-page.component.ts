import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {

  @Input() type: string | undefined;  

  cl() {
    console.log(this.type)
  }
}
