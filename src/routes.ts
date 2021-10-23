import express from 'express';
import { db } from './database/connection';
import { convertHoursToMinutes } from './utils/hoursToMinutes';

const routes = express.Router();

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

routes.post('/classes', async (request, response) => {
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  } = request.body;

  const trx = await db.transaction();

  try {
    const [user_id] = await trx('users').insert({
      name,
      avatar,
      whatsapp,
      bio
    });
  
    const [class_id] = await trx('classes').insert({
      subject,
      cost,
      user_id
    });
    
    const classSchedule = schedule.map(({ week_day, from, to }: ScheduleItem) => ({
        week_day,
        from: convertHoursToMinutes(from),
        to: convertHoursToMinutes(to),
        class_id
      }
      ));
      
      await trx('class_schedule').insert(classSchedule);
      
      await trx.commit();

      return response.status(201).send();
  } catch(err) {
    await trx.rollback();

    return response.status(400).json({
      error: 'Unexpected error while creating class'
    })
  }

});

export default routes;
