<template>
  <tdialog :zanDialogObj="zanDialog" :show.sync="show" @click="handleClick"></tdialog>
</template>

<script>
import tdialog from './Dialog'
import RoomEvents from '../events/room'
import actions from '../actions'

const _EVENT_TIME_RANGE = [3, 6]; // range, in minutes

export default {
  components: {
    tdialog
  },
  data() {
      return {
          zanDialog: {},
          show: false,
          eventStack: [],
          EventPool: [].concat(RoomEvents)
      }
  },


  computed: {
    activeEvent() {
      if(this.eventStack && this.eventStack.length > 0) {
        return this.eventStack[0];
      }
      return null;
    }
  },

  created() {
      this.scheduleNextEvent();
  },

  methods: {
    scheduleNextEvent: function(scale) {
      var nextEvent = Math.floor(Math.random()*(_EVENT_TIME_RANGE[1] - _EVENT_TIME_RANGE[0])) + _EVENT_TIME_RANGE[0];
      if(scale > 0) { nextEvent *= scale; }
      console.log('next event scheduled in ' + nextEvent + ' minutes');
      this._eventTimeout = setTimeout(this.triggerEvent, nextEvent * 60 * 1000);
    },

    triggerEvent: function() {
      if(this.activeEvent == null) {
        var possibleEvents = [];
        for(var i in this.EventPool) {
          var event = this.EventPool[i];
          if(event.isAvailable()) {
            possibleEvents.push(event);
          }
        }

        if(possibleEvents.length === 0) {
          this.scheduleNextEvent(0.5);
          return;
        } else {
          var r = Math.floor(Math.random()*(possibleEvents.length));
          this.startEvent(possibleEvents[r]);
        }
      }

      this.scheduleNextEvent();
    },

	  loadScene: function(name) {
      const scene = this.activeEvent.scenes[name]

      if(scene.onLoad) {
        scene.onLoad();
      }
    
      if (scene.notification) {
        actions.toast(scene.notification)
      }

      if(scene.reward) {
        actions.addM('stores', scene.reward);
      }

      this.startStory(scene)

        this.show = true
    },

    handleClick(scene) {
      if (scene === 'end') {
        this.endEvent()
        return
      }

      var r = Math.random();
      var lowestMatch = null;
      for(var i in scene) {
        if(r < i && (lowestMatch == null || i < lowestMatch)) {
          lowestMatch = i;
        }
      }
      if(lowestMatch != null) {
        this.loadScene(scene[lowestMatch]);
        return;
      }
      console.log('ERROR: no suitable scene found');
      this.endEvent();
    },

    endEvent() {
			this.eventStack.shift();
    },

    startStory: function(scene) {

        const buttons = Object.keys(scene.buttons, (buttonName) => {
          const button = scene.buttons[buttonName]

          return {
            text: button.text,
            nextScene: button.nextScene
          }
        })

        this.zanDialog = {
          title: scene.title,
          content: scene.text,
          buttons: scene.buttons
        }

      var leaveBtn = false;

      // if(scene.textarea != null) {
      //   var ta = $('<textarea>').val(scene.textarea).appendTo(desc);
      //   if(scene.readonly) {
      //     ta.attr('readonly', true);
      //   }
      //   Engine.autoSelect('#description textarea');
      // }

      // Draw any loot
      // var takeETbtn;
      // if(scene.loot) {
      //   takeETbtn = Events.drawLoot(scene.loot);
      // }

      // Draw the buttons
      // var exitBtns = $('<div>').attr('id','exitButtons').appendTo($('#buttons', Events.eventPanel()));
      // leaveBtn = Events.drawButtons(scene);
      // $('<div>').addClass('clear').appendTo(exitBtns);


      // Events.allowLeave(takeETbtn, leaveBtn);
    },

    startEvent: function(event, options) {
      if(event) {
        // Engine.event('game event', 'event');

        // Engine.keyLock = true;
        // Engine.tabNavigation = false;
        // Button.saveCooldown = false;

			  this.eventStack.unshift(event);

        this.loadScene('start')

        // this.zanDialog = {
        //   title: 'sdf',
        //   content: 'sdfsdv'
        // }


        // this.eventStack.unshift(event);
        // event.eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
        // if(options != null && options.width != null) {
        //   Events.eventPanel().css('width', options.width);
        // }
        // $('<div>').addClass('eventTitle').text(Events.activeEvent().title).appendTo(Events.eventPanel());
        // $('<div>').attr('id', 'description').appendTo(Events.eventPanel());
        // $('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
        // Events.loadScene('start');
        // $('div#wrapper').append(Events.eventPanel());
        // Events.eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
        // var currentSceneInformation = Events.activeEvent().scenes[Events.activeScene];
        // if (currentSceneInformation.blink) {
        //   Events.blinkTitle();
        // }
      }
    },
  }
}
</script>
