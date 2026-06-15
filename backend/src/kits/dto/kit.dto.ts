import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class KitDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  nom: string;

  @Expose()
  sous_titre: string;

  @Expose()
  description: string;

  @Expose()
  actif: boolean;
}
