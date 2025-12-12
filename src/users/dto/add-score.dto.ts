import { IsString, IsNumber, Min } from 'class-validator';

export class AddScoreDto {
  @IsString()
  gameId: string;

  @IsNumber()
  @Min(1)
  score: number;
}
