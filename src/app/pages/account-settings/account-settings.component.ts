import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html'
})
export class AccountSettingsComponent implements OnInit {
  
  constructor(private settingsServices: SettingsService) { }

  ngOnInit(): void {
    this.settingsServices.checkCurrentTheme();
  }

  // Cambio de Tema
  changeTheme(theme: string) {
    this.settingsServices.changeTheme(theme);
  }

}
