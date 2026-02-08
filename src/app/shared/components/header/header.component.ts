import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  title = input<string>('BANCO');
  showLogo = input<boolean>(true);
}
