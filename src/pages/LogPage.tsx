import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { useWeather } from '../hooks/useWeather'
import { useTodayEntry } from '../hooks/useTodayEntry'
import { usePastTags } from '../hooks/usePastTags'
import { saveMoodEntry } from '../lib/firestore'
import { getDailyHealthData } from '../utils/seededRandom'

const MOOD_EMOJIS = ['😞', '😟', '😐', '🙂', '😊']

function getMoodEmoji(value: number): string {
  const index = Math.min(Math.floor(((value - 1) / 9) * 4), 4)
  return MOOD_EMOJIS[index]
}

interface SliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  leftLabel?: string
  rightLabel?: string
  disabled?: boolean
}

function Slider({ label, value, onChange, leftLabel, rightLabel, disabled }: SliderProps) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-violet-600">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  )
}

export function LogPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const uid = user!.uid
  const today = new Date().toISOString().split('T')[0]

  const { data: existingEntry, isLoading: entryLoading } = useTodayEntry(uid)
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather()
  const { data: pastTags = [] } = usePastTags(uid)

  const [mood, setMood] = useState(5)
  const [energy, setEnergy] = useState(5)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (existingEntry) {
      setMood(existingEntry.mood)
      setEnergy(existingEntry.energy)
      setTags(existingEntry.tags)
      setEditMode(true)
    }
  }, [existingEntry])

  const health = getDailyHealthData(uid, today)

  const suggestions = pastTags.filter(
    (t) => t.toLowerCase().includes(tagInput.toLowerCase()) && tagInput.length > 0 && !tags.includes(t)
  )

  const addTag = useCallback(
    (tag: string) => {
      const cleaned = tag.trim().toLowerCase()
      if (cleaned && tags.length < 3 && !tags.includes(cleaned)) {
        setTags((prev) => [...prev, cleaned])
        setTagInput('')
      }
    },
    [tags]
  )

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  async function handleSave() {
    if (!weather) return
    setSaving(true)
    try {
      await saveMoodEntry(uid, {
        mood,
        energy,
        tags,
        weather,
        health: { sleep: Math.round(health.sleep * 10) / 10, steps: Math.round(health.steps) },
      })
      await qc.invalidateQueries({ queryKey: ['moodEntry', 'today', uid] })
      setSaved(true)
      setEditMode(true)
    } finally {
      setSaving(false)
    }
  }

  if (entryLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {editMode ? 'Edit today' : "How are you today?"}
        </h1>
        <span className="text-2xl">{getMoodEmoji(mood)}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <Slider
          label="Mood"
          value={mood}
          onChange={setMood}
          leftLabel="😞 Low"
          rightLabel="😊 High"
        />
        <Slider
          label="Energy"
          value={energy}
          onChange={setEnergy}
          leftLabel="Drained"
          rightLabel="Energized"
        />

        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Tags <span className="text-gray-400 font-normal">({tags.length}/3)</span>
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-violet-900 transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {tags.length < 3 && (
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag, press Enter"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md max-h-36 overflow-y-auto">
                  {suggestions.slice(0, 5).map((s) => (
                    <li key={s}>
                      <button
                        onClick={() => addTag(s)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-violet-50 text-gray-700"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400 mb-1">Weather</p>
          {weatherLoading ? (
            <p className="text-sm text-gray-400">Fetching…</p>
          ) : weatherError ? (
            <p className="text-sm text-red-400">Unavailable</p>
          ) : weather ? (
            <>
              <p className="text-lg font-semibold text-gray-800">{weather.temp}°C</p>
              <p className="text-xs text-gray-500 capitalize">{weather.condition}</p>
              <p className="text-xs text-gray-400">{weather.humidity}% humidity</p>
            </>
          ) : null}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs text-gray-400 mb-1">Health (est.)</p>
          <p className="text-lg font-semibold text-gray-800">
            {Math.round(health.sleep * 10) / 10}h
          </p>
          <p className="text-xs text-gray-500">Sleep</p>
          <p className="text-xs text-gray-400">{Math.round(health.steps).toLocaleString()} steps</p>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !weather || weatherLoading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl py-3 transition-colors"
      >
        {saving ? 'Saving…' : saved ? 'Saved! Update again' : editMode ? 'Update entry' : 'Save entry'}
      </button>

      {!weather && !weatherLoading && (
        <p className="text-xs text-amber-600 text-center mt-2">
          Allow location access to auto-populate weather before saving.
        </p>
      )}
    </div>
  )
}
