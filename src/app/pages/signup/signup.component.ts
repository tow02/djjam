import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { AuthenticationService } from '../../services/authentication.service';
import { filterByCityName } from 'filterbycities';
import { SpotifyUser } from '../../services/spotify.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  profileForm = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      djName: ['', [Validators.required, Validators.minLength(5)]],
      cityName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      accessToken: [''],
    },
    { validators: ConfirmPasswordValidator.MatchPassword },
  );

  isInProcess = false;
  errorMessage = '';
  statusMessage = '';
  options: Array<string> = [];
  spotifyUser: SpotifyUser;

  constructor(
    private spotifyService: SpotifyService,
    private formBuilder: FormBuilder,
    private authen: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe((param) => {
      if (param['accessToken']) {
        this.initBySpotify(param['accessToken']);
      }
    });
  }

  async initBySpotify(accessToken: string) {
    this.spotifyUser = await this.spotifyService.getProfile(accessToken);
    this.djName.setValue(this.spotifyUser.display_name);
    this.email.setValue(this.spotifyUser.email);
    this.profileForm.get('accessToken').setValue(accessToken);

    console.log(this.spotifyUser.id);
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe((val) => {
      this.options = filterByCityName(val.cityName);
    });
  }

  get djName() {
    return this.profileForm.get('djName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get cityName() {
    return this.profileForm.get('cityName');
  }

  get password() {
    return this.profileForm.get('password');
  }

  get confirmPassword() {
    return this.profileForm.get('confirmPassword');
  }

  async onSubmit() {
    console.log(this.profileForm.errors);
    if (!this.profileForm.invalid) {
      this.isInProcess = true;
      this.profileForm.disable();
      const result = await this.authen
        .signup(this.profileForm.value)
        .catch((e) => {
          console.log(e);
          this.errorMessage = e.error;
        });
      this.isInProcess = false;
      this.profileForm.enable();
      console.log(result);
      if (result && result.status && result.status === 'done') {
        delete this.errorMessage;
        this.statusMessage = result.message;
        await this.authen.login(
          this.profileForm.value.email,
          this.profileForm.value.password,
        );

        this.router.navigate(['/']);
      }
    } else console.log(this.profileForm.value);
  }
}
