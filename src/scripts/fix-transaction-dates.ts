import { loadEnvConfig } from '@next/env';
import mongoose from 'mongoose';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

/*
npx -y tsx src/scripts/fix-transaction-dates.ts
*/
async function fixTransactionDates() {
    const { TransactionModel } = await import('../server/db/schema');
    const dbConnect = (await import('../server/db/connect')).default;

    try {
        console.log('Connecting to database...');
        await dbConnect();
        console.log('Connected to database.');

        const transactions = await TransactionModel.find({});
        console.log(`Found ${transactions.length} transactions.`);

        if (transactions.length > 0) {
            console.log('Sample dates (first 5):', transactions.slice(0, 5).map(t => t.transactionDate.toISOString()));
        }

        let updatedCount = 0;

        for (const tx of transactions) {
            const date = new Date(tx.transactionDate);

            // Set time to 12:00:00 UTC
            // This ensures the date remains the same in CST (UTC-6) and CDT (UTC-5)
            // 12:00 UTC = 06:00 CST / 07:00 CDT

            const newDate = new Date(date);
            newDate.setUTCHours(12, 0, 0, 0);

            if (date.getTime() !== newDate.getTime()) {
                tx.transactionDate = newDate;
                await tx.save();
                updatedCount++;
            }
        }


        console.log(`Finished. Updated ${updatedCount} transactions.`);
    } catch (error) {
        console.error('Error fixing transaction dates:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixTransactionDates();
