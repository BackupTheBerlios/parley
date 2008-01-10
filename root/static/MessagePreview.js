/*
 * MessagePreview - show a preview of the message to be posted
 * with all ForumCode being rendered (replacing the input area)
 *
 * - Chisel Wright <chisel@herlpacker.co.uk>
 *
 */

/*
    Usage Example:

        <!-- message preview majick -->
        <script type="text/javascript" src="[%c.uri_for('/static/MessagePreview.js')%]"></script>
        <script type="text/javascript">
            var MessagePreview = new ParleyMessagePreview();

            MessagePreview.config.label_preview = '[%l('Preview')%]';
            MessagePreview.config.label_edit    = '[%l('Edit')%]';
            MessagePreview.config.post_url      = "[%c.uri_for('/post/preview')%]";

            MessagePreview.init();
        </script>
        <!-- (end) message preview majick -->

    In your HTML have a field with id 'thread_message' and a button with id 'message_preview':

        <textarea name="thread_message" id="thread_message" cols="60" rows="20" class="input_text" /></textarea>

        ...

        <input type="button" value="[%l('Preview')%]" name="post_reply" class="" id="message_preview" />
*/

(function () {
    ParleyMessagePreview = function() {
        var Dom         = YAHOO.util.Dom,
            YU          = YAHOO.util;

        this.config = {
            trigger       : 'message_preview',
            user_input    : 'thread_message',
            container     : 'message_container',
            trigger_evt   : 'click',
            post_url      : 'post/preview',
            label_edit    : 'Edit',
            label_preview : 'Preview'
        };
        this.message_source  = false;
        this.message_preview = false;

        this.handleSuccess = function(o) {
            var data = eval('(' + o.responseText + ')');
            var obj = o.argument.obj;

            if (data.formatted) {
                obj.previewElId = YU.Dom.generateId();

                obj.user_input.style.visibility     = 'hidden';

                /* create a panel to show the preview in */
                var pWidth          = obj.user_input.clientWidth,
                    pHeight         = obj.user_input.clientHeight,
                    pLeft           = obj.user_input.offsetLeft,
                    pTop            = obj.user_input.offsetTop;

                obj.preview_overlay = new YAHOO.widget.Overlay(
                    "preview_overlay",
                    {
                        context:        [obj.config.user_input, 'tl', 'tl'],
                        visible:        true,
                        width:          obj.user_input.clientWidth  + 'px',
                        height:         obj.user_input.clientHeight + 'px'
                    }
                );

                obj.preview_overlay.setBody(data.formatted);
                obj.preview_overlay.render(document.body);
                Dom.get('preview_overlay').style.overflow = 'auto';


                // update the button
                obj.trigger.value = obj.config.label_edit; //"'[%l('Edit')%]'";

                YU.Event.removeListener( obj.trigger, 'click' );
                YU.Event.addListener(
                    obj.trigger,
                    obj.config.trigger_evt,
                    obj.edit,
                    obj,
                    true
                );

            }
        };
        this.handleFailure = function(o) {
            console.log('failure');
        };

        this.edit = function() {
            // update the button
            this.trigger.value = this.config.label_preview; //"'[%l('Preview')%]'";

            this.user_input.style.visibility     = 'visible';
            this.preview_overlay.destroy();

            YU.Event.removeListener( this.trigger, 'click' );
            YU.Event.addListener(
                this.trigger,
                this.config.trigger_evt,
                this.preview,
                this,
                true
            );
        };

        this.preview = function() {
            var request = YU.Connect.asyncRequest(
                'POST',
                this.config.post_url, //'post/preview',
                {
                    success: this.handleSuccess,
                    failure: this.handleFailure,
                    argument: {
                        obj: this
                    }
                },
                'msg_source=' + escape(this.user_input.value)
            );
        };

        this.init = function() {
            this.container  = Dom.get( this.config.container );
            this.user_input = Dom.get( this.config.user_input );
            this.trigger    = Dom.get( this.config.trigger );

            YU.Event.addListener(
                this.trigger,
                this.config.trigger_evt,
                this.preview,
                this,
                true
            );
        };
    };
})();
