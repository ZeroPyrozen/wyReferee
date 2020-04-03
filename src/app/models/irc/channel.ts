import { Message } from "./message";
import { Mappool } from "../osu-mappool/mappool";

export enum TeamMode {
    HeadToHead = 0,
    TagCoop = 1,
    TeamVs = 2,
    TagTeamVs = 3
}

export enum WinCondition {
    Score = 0,
    Accuracy = 1,
    Combo = 2,
    ScoreV2 = 3
}

export class Channel {
    channelName: string;
    active: boolean = true;
    allMessages: Message[] = [];
    lastActiveChannel: boolean = false;
    isPrivateChannel: boolean = false;
    hasUnreadMessages: boolean = false;
    playSoundOnMessage: boolean = false;

    teamMode: TeamMode;
    winCondition: WinCondition;
    players: number;

    constructor(channelName: string, isPrivateChannel: boolean = false) {
        this.channelName = channelName;
        this.isPrivateChannel = isPrivateChannel;
        this.playSoundOnMessage = false;
    }
}
