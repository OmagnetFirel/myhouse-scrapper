import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('float')
  completo: number;
}
