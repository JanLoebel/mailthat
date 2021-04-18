import { Mail } from '../models/Mail';

export interface IMailSender {

  sendMail(mail: Mail): Promise<void>;

}