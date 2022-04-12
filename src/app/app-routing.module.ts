import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main-page/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ErrorComponent } from './components/main-page/error/error.component';
import { InformationComponent } from './modules/information/information/information.component';
import { AllLobbiesComponent } from './components/lobby/all-lobbies/all-lobbies.component';
import { CreateLobbyComponent } from './components/lobby/create-lobby/create-lobby.component';
import { LobbyViewComponent } from './components/lobby/lobby-view/lobby-view.component';
import { IrcComponent } from './components/irc/irc.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagementRouterComponent } from './components/tournament-management/management-router/management-router.component';
import { TournamentCreateComponent } from './components/tournament-management/tournament-create/tournament-create.component';
import { TournamentOverviewComponent } from './components/tournament-management/tournament-overview/tournament-overview.component';
import { TournamentEditComponent } from './components/tournament-management/tournament-edit/tournament-edit.component';
import { TournamentAllPublishedComponent } from './components/tournament-management/tournament-all-published/tournament-all-published.component';
import { TournamentMyPublishedComponent } from './components/tournament-management/tournament-my-published/tournament-my-published.component';
import { TournamentPublishedEditComponent } from './components/tournament-management/tournament-published-edit/tournament-published-edit.component';
import { TournamentAllPublishedAdministratorComponent } from './components/tournament-management/tournament-all-published-administrator/tournament-all-published-administrator.component';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
			{ path: '', component: InformationComponent },
			{
				path: 'information', loadChildren: () =>
					import('./modules/information/information.module').then(m => m.InformationModule)
			},
			{ path: 'settings', component: SettingsComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'lobby-overview', component: AllLobbiesComponent },
			{ path: 'lobby-overview/create-lobby', component: CreateLobbyComponent },
			{ path: 'lobby-overview/lobby-view/:id', component: LobbyViewComponent },
			{
				path: 'tournament-management', component: ManagementRouterComponent, children: [
					{ path: 'tournament-overview', component: TournamentOverviewComponent },
					{ path: 'tournament-overview/tournament-create', component: TournamentCreateComponent },
					{ path: 'tournament-overview/tournament-edit/:id', component: TournamentEditComponent },
					{ path: 'tournament-overview/tournament-my-published/tournament-published-edit/:id', component: TournamentPublishedEditComponent },
					{ path: 'tournament-overview/tournament-my-published', component: TournamentMyPublishedComponent },
					{ path: 'tournament-overview/tournament-all-published', component: TournamentAllPublishedComponent },
					{ path: 'tournament-overview/tournament-all-published-administrator', component: TournamentAllPublishedAdministratorComponent }
				]
			},
			{
				path: 'axs',
				loadChildren: () =>
					import('./modules/axs/axs.module').then(m => m.AxsModule)
			},
			{ path: 'irc', component: IrcComponent },
			{ path: '**', component: ErrorComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})

export class AppRoutingModule { }
