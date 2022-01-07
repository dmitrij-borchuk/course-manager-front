import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { TextInput } from 'react-materialize'
import { Text } from '../text/Text'
import { Tag } from './Tag'

interface Props {
  loading?: boolean
  disabled?: boolean
  error?: string
  value?: string[]
  onUpdate?: (value: string[]) => void
}
export const TagsEditor = ({ disabled, loading, error, value = [], onUpdate }: Props) => {
  const intl = useIntl()
  const inputRef = useRef<HTMLInputElement>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const newTag = e.target.value
        const clone = [...value]
        if (editIndex !== null) {
          clone.splice(editIndex, 1, newTag)
        } else {
          clone.push(newTag)
        }
        onUpdate && onUpdate(clone)
        e.target.value = ''
        setEditIndex(null)
      }
    },
    [editIndex, onUpdate, value]
  )
  const onRemove = useCallback(
    (index: number) => {
      const clone = [...value]
      clone.splice(index, 1)
      onUpdate && onUpdate(clone)
    },
    [onUpdate, value]
  )
  const onEdit = useCallback((index: number) => {
    setEditIndex(index)
  }, [])
  useEffect(() => {
    const el = inputRef.current
    if (!el) {
      return
    }
    el.addEventListener('keydown', onKeyDown)

    return () => {
      el.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])
  useEffect(() => {
    if (inputRef.current) {
      if (editIndex !== null) {
        inputRef.current.value = value[editIndex]
        inputRef.current?.focus()
      } else {
        inputRef.current.value = ''
      }
    }
  }, [editIndex, value])
  useEffect(() => {
    setEditIndex(null)
  }, [value])

  return (
    <div>
      <Text type="h5" className="color-primary">
        <FormattedMessage id="students.tags" />
      </Text>
      {value.length > 0 && (
        <Text type="body" className="color-text-gray">
          <FormattedMessage id="students.tags.editInfo" />
        </Text>
      )}
      {value.length === 0 ? (
        <Text type="body" className="color-text-gray">
          <FormattedMessage id="students.tags.empty" />
        </Text>
      ) : (
        value.map((t, i) => (
          <Tag
            key={t}
            className={`mr-1 ${editIndex === i ? 'bg-secondary' : ''}`}
            onClose={() => onRemove(i)}
            onClick={() => onEdit(i)}
          >
            {t}
          </Tag>
        ))
      )}
      <div className="mt-6">
        <TextInput
          error={error}
          label={`${intl.formatMessage({ id: 'common.form.newTag.label' })}`}
          ref={inputRef}
          disabled={disabled || loading}
        />
      </div>
    </div>
  )
}
