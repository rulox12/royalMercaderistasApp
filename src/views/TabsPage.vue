<template>
  <ion-page>
    <ion-tabs class="menu">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="createOutline" />
          <ion-label>Generar pedido</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="bagRemove" />
          <ion-label>Ordenes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" color="suceess">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { person, createOutline, bagRemove } from 'ionicons/icons';
</script>

<style scoped>
.menu {
  --color: #ff0000 !important;
}
</style>