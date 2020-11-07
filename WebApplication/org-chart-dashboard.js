(function($) {
    $.fn.orgChart = function(options) {
        var opts = $.extend({}, $.fn.orgChart.defaults, options);
        return new OrgChart($(this), opts);
    }

    $.fn.orgChart.defaults = {
        data: [{
            id: 1,
            name: 'Root',
            parent: 0
        }]
    };

    function OrgChart($container, opts) {
        var data = opts.data;
        var nodes = {};
        var rootNodes = [];
        this.opts = opts;
        this.$container = $container;
        var self = this;

        this.draw = function() {
            $container.empty().append(rootNodes[0].render(opts));

            $container.find('.node').click(function() {
                var node = nodes[$(this).attr('node-id')];
                self.showOrHideChildren(node.data.id);
            });
            $container.find('.departmentnode').click(function() {
                var node = nodes[$(this).attr('node-id')];
                self.showOrHideChildren(node.data.id);
            });
            $container.find('.orgnode').click(function() {
                var node = nodes[$(this).attr('node-id')];
                self.showOrHideChildren(node.data.id);
            });

        }


        this.showOrHideChildren = function(id) {
            nodes[id].data.showChildren = !nodes[id].data.showChildren;
            self.draw();
        }

        this.getData = function() {
            var outData = [];
            for (var i in nodes) {
                outData.push(nodes[i].data);
            }
            return outData;
        }

        for (var i in data) {
            var node = new Node(data[i]);
            nodes[data[i].id] = node;
        }

        for (var i in nodes) {
            if (nodes[i].data.parent == 0) {
                rootNodes.push(nodes[i]);
            } else {
                nodes[nodes[i].data.parent].addChild(nodes[i]);
            }
        }

        // draw org chart
        $container.addClass('orgChart');
        self.draw();
    }

    function Node(data) {
        this.data = data;
        this.children = [];
        var self = this;

        this.addChild = function(childNode) {
            this.children.push(childNode);
        }


        this.render = function(opts) {

            var childLength = self.children.length,
                mainTable;

            mainTable = "<table cellpadding='0' cellspacing='0' border='0'>";
            var nodeColspan = childLength > 0 ? 2 * childLength : 2;
            mainTable += "<tr><td colspan='" + nodeColspan + "'>" + self.formatNode(opts) + "</td> </tr>";

            if (this.data.showChildren && childLength > 0) {
                var downLineTable = "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";
                mainTable += "<tr class='lines' id='children_3'><td colspan='" + childLength * 2 + "'>" + downLineTable + '</td></tr>';

                var linesCols = '';
                for (var i = 0; i < childLength; i++) {
                    if (childLength == 1) {
                        linesCols += "<td class='line left half'></td>"; 
                    } else if (i == 0) {
                        linesCols += "<td class='line first-left'></td>";
                    } else if (i == childLength - 1) {
                        linesCols += "<td class='line left top last-left'></td>";
                    } else {
                        linesCols += "<td class='line left top'></td>";
                    }

                    if (childLength == 1) {
                        linesCols += "<td class='line right half'></td>";
                    } else if (i == 0) {
                        linesCols += "<td class='line top first-right'></td>";

                    } else if (i == childLength - 1) {
                        linesCols += "<td class='line last-right'></td>";
                    } else {
                        linesCols += "<td class='line right top'></td>";
                    }
                }
                mainTable += "<tr class='lines v' id='children_3'>" + linesCols + "</tr>";
                mainTable += "<tr id='children_3'>";
                for (var i in self.children) {
                    mainTable += "<td colspan='2'>" + self.children[i].render(opts) + "</td>";
                }
                mainTable += "</tr>";

            }
            mainTable += '</table>';
            return mainTable;
        }

        this.formatNode = function(opts) {
            var titleString = '',
                managerString = '';
            if (typeof data.name !== 'undefined') {
                titleString = '<label class="position-label">' + self.data.name + '</label>';
            }
            var nodeClass = "orgnode";
            if (this.data.parent == 1) {
                nodeClass = "departmentnode";
            } else if (this.data.parent == 0) {
                nodeClass = "node"
            }
            if (typeof data.manager !== 'undefined') {
                managerString = "<label class='manager-label'>" + self.data.manager + '</label>';
            }

            return "<div class='" + nodeClass + "' node-id='" + this.data.id + "'>" + titleString + managerString + "</div>";
        }
    }

})(jQuery);


var testData = [{
        id: 1,
        name: 'Uber',
        manager: 'CEO: Dara Khosrowshahi',
        parent: 0,
        showChildren: true
    },
    {
        id: 2,
        name: 'Product',
        manager: 'CPO: Dara Khosrowshahi',
        parent: 1,
        showChildren: false
    },
    {
        id: 3,
        name: 'Technology',
        manager: 'CTO: Thuan Pham',
        parent: 1,
        showChildren: false
    },
    {
        id: 4,
        name: 'Uber ATG',
        manager: 'Head: Raquel Urtasun',
        parent: 1,
        showChildren: false
    },
    {
        id: 5,
        name: 'Platform Growth & Customer Engagement',
        manager: 'VP: Zhenya Lindgardt',
        parent: 1,
        showChildren: false
    },
    {
        id: 6,
        name: 'Product & Data Science',
        manager: 'VP of Technology:Sundeep Jain',
        parent: 2,
        showChildren: false
    },
    {
        id: 7,
        name: 'Payment(Uber Money)',
        manager: 'Head: Peter Hazlehurst',
        parent: 2,
        showChildren: false
    },
    {
        id: 8,
        name: 'Product Design',
        manager: 'VP: Michael Gough',
        parent: 2,
        showChildren: false
    },
    {
        id: 9,
        name: 'Global Scaled Solutions',
        manager: 'Director: Megha Yethadka',
        parent: 2,
        showChildren: false
    },
    {
        id: 10,
        name: 'Business and Developer Products',
        manager: 'Sr Director: Eckart Walther',
        parent: 2,
        showChildren: false
    },
    {
        id: 11,
        name: 'Product Engineering',
        manager: 'VP of Technology: Peeyush Nahar',
        parent: 3,
        showChildren: false
    },
    {
        id: 12,
        name: 'Mobility & Marketplace',
        manager: 'Head: Gaurav Garg',
        parent: 3,
        showChildren: false
    },
    {
        id: 13,
        name: 'Product Platform (business infrastructure)',
        manager: 'Sr Director: Jennifer Anderson',
        parent: 3,
        showChildren: false
    },
    {
        id: 14,
        name: 'infrastructure',
        manager: 'Sr Director: Sumanth Sukumar',
        parent: 3,
        showChildren: false
    },
    {
        id: 15,
        name: 'Eats Engineering',
        manager: 'Sr Director: Haider Sabri',
        parent: 3,
        showChildren: false
    },
    {
        id: 16,
        name: 'Technical Program Management & Learning',
        manager: 'Sr Director: Sophia Vicent',
        parent: 3,
        showChildren: false
    },
    {
        id: 17,
        name: 'Information Technology',
        manager: 'CIO: Shobhana Ahluwalla',
        parent: 3,
        showChildren: false
    },
    {
        id: 18,
        name: 'Software Engineering',
        manager: 'VP: Jon Thomason',
        parent: 4,
        showChildren: false
    },
    {
        id: 19,
        name: 'Systems Engineering & Testing',
        manager: 'Head: Adrian Thompson',
        parent: 4,
        showChildren: false
    },
    {
        id: 20,
        name: 'Hardware & Vehicle',
        manager: 'Head: Stephen Lesh',
        parent: 4,
        showChildren: false
    },
    {
        id: 21,
        name: 'Supply Chain',
        manager: 'Head: Sameer Kshirsagar',
        parent: 4,
        showChildren: false
    },
    {
        id: 22,
        name: 'Safety',
        manager: 'Head: Nat Beuse',
        parent: 4,
        showChildren: false
    },
    {
        id: 23,
        name: 'Research & Development',
        manager: 'Head: Raquel Urtasun',
        parent: 4,
        showChildren: false
    },
    {
        id: 24,
        name: 'Product & Design',
        manager: 'Head: Eric Hanson',
        parent: 4,
        showChildren: false
    },
    {
        id: 25,
        name: 'Strategy',
        manager: 'Head: Austin Geidt',
        parent: 4,
        showChildren: false
    },
    {
        id: 26,
        name: 'Uber Works',
        manager: 'CEO: Andrey Liscovich',
        parent: 5,
        showChildren: false
    },
    {
        id: 27,
        name: 'Uber Transit',
        manager: 'GM: David Reich',
        parent: 5,
        showChildren: false
    },
    {
        id: 28,
        name: 'Customer Engagement',
        manager: 'Head: Jon Venuto',
        parent: 5,
        showChildren: false
    },
    {
        id: 29,
        name: 'Incubator',
        manager: 'Head: Karishma Shah',
        parent: 5,
        showChildren: false
    },

];


$(function() {
    org_chart = $('#orgChart').orgChart({
        data: testData
    });
});