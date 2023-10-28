/*
 Abstraction of .env file.
 Three operations:
    - getValues: get the value of an environment variable as a list of tuples
    - getValue: get the value of an environment variable as a string
    - setValue: insert or update the value of an environment variable
 */

import * as fs from 'fs';
import * as path from 'path';

export type envValue = {
    key: string,
    value: string
}

const envPath = path.join(__dirname, '../../.env');

export class envConfig {

    public getValues(): envValue[] {
        const env = fs.readFileSync(envPath, 'utf-8');
        const lines = env.split('\n');
        const values: envValue[] = [];
        for (const line of lines) {
            if (line.length > 0) {
                let [key, value] = line.split('=');
                if (key != undefined && value != undefined) {
                    key = key.trim();
                    value = value.trim().substring(1, value.length - 1) // remove quotes
                    // remove \r if present
                    if (value[value.length - 1] == '\r') {
                        value = value.substring(0, value.length - 1);
                    }
                    values.push({key, value});
                }
            }
        }
        return values;
    }

    public getValue(key: string): string {
        const values = this.getValues();
        for (const value of values) {
            if (value.key == key) {
                return value.value;
            }
        }
        return '';
    }

    public setValue(key: string, value: string): void {
        const values = this.getValues();
        let found = false;
        for (const v of values) {
            if (v.key == key) {
                v.value = value;
                found = true;
            }
        }
        if (!found) {
            values.push({key, value});
        }
        let env = '';
        for (const v of values) {
            env += `${v.key}="${v.value}"\n`;
        }
        fs.writeFileSync(envPath, env);
    }
}