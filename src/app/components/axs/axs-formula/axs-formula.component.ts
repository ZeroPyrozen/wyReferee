import { Component, OnInit } from '@angular/core';
import { Calculations } from 'app/models/calculations';
import { MultiplayerGameScore } from 'app/models/osu-models/multiplayer-game-score';
import { MultiplayerMatch } from 'app/models/osu-models/multiplayer-match';
import { AxSCalculation } from 'app/models/score-calculation/calculation-types/axs-calculation';
import { ProposedCalculation } from 'app/models/score-calculation/calculation-types/proposed-calculation';
import { MultiplayerDataUser } from 'app/models/store-multiplayer/multiplayer-data-user';
import { GetMultiplayerService } from 'app/services/osu-api/get-multiplayer.service';

@Component({
	selector: 'app-axs-formula',
	templateUrl: './axs-formula.component.html',
	styleUrls: ['./axs-formula.component.scss']
})
export class AxsFormulaComponent implements OnInit {
	multiplayerLink: string = 'https://osu.ppy.sh/community/matches/76323975';
	multiplayerMatch: MultiplayerMatch;
	calculatedScores: any;

	constructor(private getMultiplayer: GetMultiplayerService) { }
	ngOnInit(): void { }

	/**
	 * Parse data for the given multiplayer match
	 */
	calculateMultiplayer() {
		this.getMultiplayer.get(this.multiplayerLink).subscribe(multiplayerMatchResult => {
			this.multiplayerMatch = multiplayerMatchResult;
			this.calculatedScores = this.calculateScores(this.multiplayerMatch);
		});
	}

	/**
	 * Calculate the scores of all the games played in the MultiplayerMatch
	 * @param match the match to calculate the scores of
	 */
	calculateScores(match: MultiplayerMatch) {
		let allBeatmaps = [];

		for (let game in match.games) {
			const currentGame = match.games[game];

			let beatmap = {
				beatmapId: currentGame.beatmap_id,
				scores: [],
				team_one_score: 0,
				team_two_score: 0,
				axs_team_one_score: 0,
				axs_team_two_score: 0,
				proposed_team_one_score: 0,
				proposed_team_two_score: 0
			};

			const axsScoreInterface = new AxSCalculation('AxS', 3);
			const proposedScoreInterface = new ProposedCalculation('AxS', 3);

			/**
			 * Change the modifiers to whatever you want, might add something else to make this more dynamic, but for now like this :)
			 */
			axsScoreInterface.setModifier(20);
			proposedScoreInterface.setModifier(20);

			for (let score in currentGame.scores) {
				const newMpDataUser = new MultiplayerDataUser();

				newMpDataUser.user = currentGame.scores[score].user_id;
				newMpDataUser.score = currentGame.scores[score].score;
				newMpDataUser.accuracy = Calculations.getAccuracyOfScore(currentGame.scores[score]);
				newMpDataUser.passed = currentGame.scores[score].pass;
				newMpDataUser.slot = currentGame.scores[score].slot;
				newMpDataUser.mods = currentGame.scores[score].enabled_mods;

				axsScoreInterface.addUserScore(newMpDataUser);
				proposedScoreInterface.addUserScore(newMpDataUser);

				if ([0, 1, 2].indexOf(Number(newMpDataUser.slot)) > -1) {
					beatmap.team_one_score += Number(newMpDataUser.score);
				}
				else {
					beatmap.team_two_score += Number(newMpDataUser.score);
				}
			}

			beatmap.axs_team_one_score = axsScoreInterface.calculateTeamOneScore();
			beatmap.axs_team_two_score = axsScoreInterface.calculateTeamTwoScore();

			beatmap.proposed_team_one_score = proposedScoreInterface.calculateTeamOneScore();
			beatmap.proposed_team_two_score = proposedScoreInterface.calculateTeamTwoScore();

			for (let score in currentGame.scores) {
				const currentScore = currentGame.scores[score];

				const newMpDataUser = new MultiplayerDataUser();

				newMpDataUser.user = currentGame.scores[score].user_id;
				newMpDataUser.score = currentGame.scores[score].score;
				newMpDataUser.accuracy = Calculations.getAccuracyOfScore(currentGame.scores[score]);
				newMpDataUser.passed = currentGame.scores[score].pass;
				newMpDataUser.slot = currentGame.scores[score].slot;
				newMpDataUser.mods = currentGame.scores[score].enabled_mods;

				let gameScore = {
					slot: currentScore.slot,
					mods: currentScore.enabled_mods,
					accuracy: this.calculateAccuracy(currentScore),
					normal_score: currentScore.score,
					axs_score: (currentScore.slot == 0 || currentScore.slot == 3) ? AxSCalculation.calculateScorePlayerScore(newMpDataUser, axsScoreInterface.getModifier()).toFixed() : AxSCalculation.calculateScorePlayerScore(newMpDataUser, axsScoreInterface.getModifier()).toFixed(),
					proposed_score: (currentScore.slot == 0 || currentScore.slot == 3) ? ProposedCalculation.calculateAccuracyPlayerScore(currentScore.score).toFixed() : ProposedCalculation.calculateScorePlayerScore(currentScore.score, this.calculateAccuracy(currentScore), proposedScoreInterface.getModifier()).toFixed()
				}

				beatmap.scores.push(gameScore);
			}

			allBeatmaps.push(beatmap);
		}

		return allBeatmaps;
	}

	/**
	 * Calculate the accuracy of the given score
	 * @param score the score used to calculate the accuracy
	 */
	calculateAccuracy(score: MultiplayerGameScore) {
		return Calculations.getAccuracyOfScore(score);
	}

	/**
	 * Split the string
	 * @param nStr the string to split
	 * @param splitter the character to split the string with
	 */
	addDot(nStr: any, splitter: any) {
		nStr += '';
		const x = nStr.split('.');
		let x1 = x[0];
		const x2 = x.length > 1 ? '.' + x[1] : '';
		const rgx = /(\d+)(\d{3})/;

		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + splitter + '$2');
		}

		return x1 + x2;
	}
}
