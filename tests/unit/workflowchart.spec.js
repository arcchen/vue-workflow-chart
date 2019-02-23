import WorkflowChart from '../../src/components/WorkflowChart.vue';
import { Component, build } from './ComponentBuilder';
import { installSizeStub, positionOf } from './tester/label';
import { cloneDeep } from 'lodash';

import Vue from 'vue';


const transitions = [{
    id: "Kj7tqn",
    source: "static_state_deleted",
    target: "static_state_new",
    label: "wiederherstellen",
}, {
    id: "delete",
    source: "Hvfw2ds",
    target: "static_state_deleted",
    label: "delete",
}, {
    id: "Tpyly6p",
    source: "static_state_new",
    target: "Hvfw2ds",
    label: "freigeben",
}];

const states= [{
    id: "static_state_new",
    label: "Neu",
}, {
    id: "static_state_deleted",
    label: "Gelöscht",
}, {
    id: "Hvfw2ds",
    label: "Freigegeben",
}];

const layoutStatesOf = (chart) => chart.vm.layoutStates;

const layoutTransitionsOf = (chart) => chart.vm.layoutTransitions;


const positionIn = (chart, ref) => {
    const state = chart.find({ ref });
    return positionOf(state);
};

const ofState = (label) => label;

describe("Workflow Chart component", ()  => {

    it("has transitions and states", () => {
        const chart = build(new Component(WorkflowChart)
            .and.props({ transitions, states }));

        expect(layoutStatesOf(chart)).not.toEqual([]);
        expect(layoutTransitionsOf(chart)).not.toEqual([]);
    });

    it("updates state", () => {
        const chart = build(new Component(WorkflowChart).mount()
            .and.props({ transitions: [], states: [{ id: 'new', label: 'New' }] }));

        chart.setProps({ states: [{ id: 'new', label: 'Other label' }] });
        const state = chart.find({ ref: 'new' });

        expect(state.text()).toBe('Other label');
    });

    it("emits size after state is updated", () => {
        const chart = build(new Component(WorkflowChart)
            .and.props({ transitions: [], states: [{ id: 'new', label: 'New' }] }));

        chart.setProps({ states: [{ id: 'new', label: 'Other label' }] });

        expect(chart.emitted('size-change').length).toBe(2);
    });

    xit("updates transitions", async () => {
        const chart = build(new Component(WorkflowChart).mount()
            .and.props({
                states: [
                    { id: 'state_1', label: 'new' },
                    { id: 'state_2', label: 'deleted' },
                ],
                transitions: [
                    { id: 'trans_1', label: 'delete', target: 'state_2', source: 'state_1' },
                ],
            }));

        chart.setProps({ transitions: [
            { id: 'trans_1', label: 'changed label', target: 'state_2', source: 'state_1' },
        ] });

        const transition = chart.find({ ref: 'trans_1' });
        expect(transition.text()).toBe('changed label');
    });

    it("emits size of chart", () => {
        const chart = build(new Component(WorkflowChart)
            .with.props({ transitions: [], states: [{ id: '1', label: 'Deleted' }] }));

        expect(chart.emitted('size-change')).toEqual([[{
            width: expect.any(Number),
            height: expect.any(Number),
        }]]);
    });
});
