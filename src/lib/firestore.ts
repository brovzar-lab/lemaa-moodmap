import { doc, getDoc, setDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { MoodEntry, MoodEntryInput } from '../types'

export interface MoodEntryWithDate extends MoodEntry {
  date: string
}

export function getMoodEntryId(): string {
  return new Date().toISOString().split('T')[0]
}

export async function getTodayEntry(uid: string): Promise<MoodEntry | null> {
  const entryId = getMoodEntryId()
  const ref = doc(db, 'users', uid, 'moodEntries', entryId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as MoodEntry) : null
}

export async function saveMoodEntry(uid: string, data: MoodEntryInput): Promise<void> {
  const entryId = getMoodEntryId()
  const ref = doc(db, 'users', uid, 'moodEntries', entryId)
  await setDoc(ref, { ...data, createdAt: serverTimestamp() })
}

export async function getAllEntries(uid: string): Promise<MoodEntryWithDate[]> {
  const ref = collection(db, 'users', uid, 'moodEntries')
  const q = query(ref, orderBy('__name__', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ date: d.id, ...(d.data() as MoodEntry) }))
}

export async function getPastTags(uid: string): Promise<string[]> {
  const ref = collection(db, 'users', uid, 'moodEntries')
  const snap = await getDocs(ref)
  const tagSet = new Set<string>()
  snap.forEach((d) => {
    const entry = d.data() as MoodEntry
    entry.tags?.forEach((t) => tagSet.add(t))
  })
  return Array.from(tagSet)
}
