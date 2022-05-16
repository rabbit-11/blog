
import flagwind from "flagwind-core";
import Vue from "vue";
import { component } from "flagwind-web";

/**
 * 
 * @param uri 标注当前类型是一个广播接收器。
 * @param options 可选参数
 */
export function receivable(uri: string, options: { isGlobal?: boolean; priority?: number } = { isGlobal: false, priority: 0 }) {
    if (!uri) {
        throw new flagwind.InvalidOperationException("The broadcast uri is empty.");
    }

    return function (target: any, name: any, descriptor: any) {

        let mounted = target.mounted;
        target.mounted = function () {
            if (this.$eventBus === undefined && (!options.isGlobal)) {
                this.$eventBus = new EventBus((new Date()).getTime() + "");
            }
            this.$subscribe(uri, descriptor.value, options.priority);
            if (mounted) {
                mounted.apply(this);
            }
        };
    };
}

export class EventBus extends flagwind.BroadcastManager {
    public id: string;
    public constructor(id: string) {
        super();
        this.id = id;
    }
}

@component
export class EventBusMixin extends Vue {

    public _eventNames: Array<string> = [];

    public get eventNames() {
        if (this._eventNames === undefined) {
            this._eventNames = [];
        }
        return this._eventNames;
    }

    public $eventBus: flagwind.BroadcastManager | undefined;

    public $subscribe(uri: string, fn: Function, priority?: number) {
        this.eventNames.push(uri);
        let contract = new flagwind.BroadcastContract(uri);
        if (priority !== undefined) {
            contract.priority = priority;
        }
        (this.$eventBus || flagwind.BroadcastManager.instance).register(contract, new VueReceiver(this, fn));
    }

    public $publish(uri: string, args?: any) {
        let map = new flagwind.Map<string, any>();
        if (args) {
            Object.keys(args).forEach(key => {
                map.set(key, args[key]);
            });
        }
        let broadcast = new flagwind.Broadcast(uri, map);

        let $this: any = this;
        do {
            let bus = ($this.$eventBus || flagwind.BroadcastManager.instance);
            let entries: flagwind.Map<string, any> = bus.receiverProvider._entries;
            if (entries.has(broadcast.uri)) {
                bus.send(broadcast);
                break;
            } else {
                $this = $this.$parent;
            }
        }
        while ($this != null);
    }

    public destroyed() {
        let bus = (this.$eventBus || flagwind.BroadcastManager.instance);
        if (this.eventNames && this.eventNames.length > 0) {
            this.eventNames.forEach(uri => {
                bus.unregister(new flagwind.BroadcastContract(uri));
            });
            // console.info("局部eventBus自动销毁");
        }
    }
}

export class VueReceiver implements flagwind.IBroadcastReceiver {
    private target: any;
    private method: Function;

    public constructor(target: any, fn: Function) {
        this.target = target;
        this.method = fn;
    }
    public receive(context: flagwind.BroadcastContext): void {
        this.method.apply(this.target, [context.extras]);
    }
}