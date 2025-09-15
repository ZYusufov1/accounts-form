<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NAlert, NIcon } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { uid } from './utils/uid.ts'

interface TempRow { id: string }
const rows = ref<TempRow[]>([])

function addRow() {
  rows.value.push({ id: uid() })
}
</script>

<template>
  <div class="accounts">
    <header class="accounts__header">
      <h1 class="accounts__title">Учетные записи</h1>

      <n-button class="accounts__add" type="primary" round @click="addRow">
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        Добавить
      </n-button>
    </header>

    <n-alert class="accounts__hint" type="info" :show-icon="true">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </n-alert>

    <section class="accounts__list">
      <div v-if="rows.length === 0" class="accounts__empty">
        Нет учетных записей. Нажмите «Добавить».
      </div>

      <div
          v-for="r in rows"
          :key="r.id"
          class="accounts__row accounts__row--skeleton"
      >
        <div class="accounts__cell accounts__cell--labels">Метки</div>
        <div class="accounts__cell accounts__cell--type">Тип записи</div>
        <div class="accounts__cell accounts__cell--login">Логин</div>
        <div class="accounts__cell accounts__cell--password">Пароль</div>
        <div class="accounts__cell accounts__cell--actions">Действия</div>
      </div>
    </section>
  </div>
</template>

<style>

.accounts {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 16px;
}

.accounts__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.accounts__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.accounts__hint {
  margin-top: 12px;
}

.accounts__list {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.accounts__empty {
  opacity: 0.7;
  font-size: 14px;
}

.accounts__row {
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 1fr 1fr 72px;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.accounts__row--skeleton .accounts__cell {
  min-height: 38px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
}

.accounts__cell--actions {
  text-align: center;
}
</style>