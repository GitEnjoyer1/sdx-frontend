import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import type { Components } from "@swisscom/sdx"
import { ViewChild } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'sdx-frontend';
  @ViewChild('userChoice') sdxSelectElement!: Components.SdxSelect;
  ngAfterViewInit() {
    this.sdxSelectElement.label = "What is your choice?";
  }
  
}
