//
//  EqViewManager.m
//  nativeWu
//
//  Created by Sean Purcell on 4/8/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "EqViewManager.h"
#import "EqView.h"

@implementation EqViewManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
    return [[EqView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(enableAnimation, BOOL);
RCT_EXPORT_VIEW_PROPERTY(barColor, UIColor);

@end
