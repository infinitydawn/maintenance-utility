'use client';
import styles from './crossmark.module.css';

export default function Crossmark() {
    return (
        <div className="absolute right-5 flex items-center justify-center">
            <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className={styles.checkmark__circle} cx="26" cy="26" r="25" fill="none" />
                <path className={styles.checkmark__check} fill="none" d="M16 16 36 36 M36 16 16 36" />
            </svg>
        </div>
    );
}