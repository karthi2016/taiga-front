/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: modules/common/attachments.coffee
 */

import * as angular from "angular"

//############################################################################
//# Delete Project Lightbox Directive
//############################################################################

export let DeleteProjectDirective = function($repo, $rootscope, $auth, $location, $navUrls, $confirm, lightboxService, tgLoader, currentUserService) {
    let link = function($scope, $el, $attrs) {
        let projectToDelete = null;
        $scope.$on("deletelightbox:new", function(ctx, project){
            lightboxService.open($el);
            return projectToDelete = project;
        });

        $scope.$on("$destroy", () => $el.off());

        let submit = function() {
            tgLoader.start();
            lightboxService.close($el);

            let promise = $repo.remove(projectToDelete);

            promise.then(function(data) {
                tgLoader.pageLoaded();
                $rootscope.$broadcast("projects:reload");
                $location.path($navUrls.resolve("home"));
                $confirm.notify("success");
                return currentUserService.loadProjects();
            });

            // FIXME: error handling?
            return promise.then(null, function() {
                $confirm.notify("error");
                return lightboxService.close($el);
            });
        };

        $el.on("click", ".button-red", function(event) {
            event.preventDefault();
            return lightboxService.close($el);
        });

        return $el.on("click", ".button-green", function(event) {
            event.preventDefault();
            return submit();
        });
    };

    return {link};
};
